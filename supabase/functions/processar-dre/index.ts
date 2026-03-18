import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) throw new Error('No authorization header')

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) throw new Error('File is missing')

    const match = file.name.match(/(\d{4})-(\d{2})/)
    if (!match) throw new Error('Filename must contain YYYY-MM (e.g., 2024-05.xlsx)')
    const ano = parseInt(match[1], 10)
    const mes = parseInt(match[2], 10)
    const trimestre = Math.ceil(mes / 3)
    const periodo = `${match[1]}-${match[2]}`

    const arrayBuffer = await file.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    const rows = []
    let total_receita = 0
    let total_despesa = 0

    for (let i = 1; i < json.length; i++) {
      const row = json[i]
      if (!row || !row.length) continue

      const code = String(row[0] || '').trim()
      const desc = String(row[1] || '').trim()

      if (!code || code.toLowerCase().includes('total') || code.toLowerCase().includes('cód'))
        continue

      const rec = Number(row[11]) || 0
      const des = Number(row[12]) || 0
      const sal = Number(row[13]) || 0

      const parts = code.split('.')
      let nivel = 4
      if (parts.length === 1) nivel = 1
      else if (parts.length === 2) nivel = parts[1].length === 3 ? 2 : 3
      else if (parts.length >= 3) nivel = 4

      if (nivel === 1) {
        total_receita += rec
        total_despesa += des
      }

      rows.push({ codigo: code, descricao: desc, receita: rec, despesa: des, saldo: sal, nivel })
    }

    const { data: upload, error: uploadErr } = await supabase
      .from('dre_uploads')
      .insert({
        nome_arquivo: file.name,
        periodo,
        ano,
        mes,
        trimestre,
        total_receita,
        total_despesa,
        saldo: total_receita - total_despesa,
        user_id: user.id,
      })
      .select()
      .single()

    if (uploadErr) throw uploadErr

    const linhas = rows.map((r) => ({
      ...r,
      upload_id: upload.id,
      periodo,
      ano,
      mes,
      user_id: user.id,
    }))
    const { error: linhasErr } = await supabase.from('dre_linhas').insert(linhas)
    if (linhasErr) throw linhasErr

    return new Response(JSON.stringify({ upload_id: upload.id, processed_lines: rows.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
