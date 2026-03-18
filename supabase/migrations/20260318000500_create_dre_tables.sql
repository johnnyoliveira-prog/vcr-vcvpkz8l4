-- Create dre_uploads table
CREATE TABLE public.dre_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_arquivo TEXT,
  periodo TEXT,
  ano INTEGER,
  mes INTEGER,
  trimestre INTEGER,
  total_receita NUMERIC,
  total_despesa NUMERIC,
  saldo NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create dre_linhas table
CREATE TABLE public.dre_linhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES public.dre_uploads(id) ON DELETE CASCADE,
  codigo TEXT,
  descricao TEXT,
  nivel INTEGER,
  grupo_pai TEXT,
  receita NUMERIC,
  despesa NUMERIC,
  saldo NUMERIC,
  periodo TEXT,
  ano INTEGER,
  mes INTEGER,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.dre_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dre_linhas ENABLE ROW LEVEL SECURITY;

-- Policies for dre_uploads
CREATE POLICY "Users can manage their own dre_uploads"
  ON public.dre_uploads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for dre_linhas
CREATE POLICY "Users can manage their own dre_linhas"
  ON public.dre_linhas
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_dre_uploads_user_id ON public.dre_uploads(user_id);
CREATE INDEX idx_dre_uploads_periodo ON public.dre_uploads(ano, mes);
CREATE INDEX idx_dre_linhas_upload_id ON public.dre_linhas(upload_id);
CREATE INDEX idx_dre_linhas_user_id ON public.dre_linhas(user_id);
