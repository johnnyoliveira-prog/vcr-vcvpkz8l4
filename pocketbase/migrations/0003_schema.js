migrate(
  (app) => {
    const getCol = (name) => {
      const variations = [
        name,
        name.toLowerCase(),
        name.toUpperCase(),
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        name
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('_'),
        name
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(''),
        name.replace(/_/g, ''),
      ]
      for (const v of variations) {
        try {
          return app.findCollectionByNameOrId(v)
        } catch (_) {}
      }
      return null
    }

    // profiles
    let profiles = getCol('profiles')
    if (!profiles) {
      profiles = new Collection({
        name: 'profiles',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'user',
            type: 'relation',
            required: true,
            collectionId: '_pb_users_auth_',
            maxSelect: 1,
          },
          { name: 'full_name', type: 'text' },
          { name: 'name', type: 'text' },
          { name: 'avatar_url', type: 'text' },
          { name: 'role', type: 'text' },
          { name: 'email', type: 'email' },
          { name: 'allowed_routes', type: 'json' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_profiles_user ON profiles (user)'],
      })
      app.save(profiles)
    }

    // dre_uploads
    let dre_uploads = getCol('dre_uploads')
    if (!dre_uploads) {
      dre_uploads = new Collection({
        name: 'dre_uploads',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'file_name', type: 'text' },
          { name: 'uploaded_by', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'status', type: 'text' },
          { name: 'ano', type: 'number' },
          { name: 'mes', type: 'number' },
          { name: 'total_receita', type: 'number' },
          { name: 'total_despesa', type: 'number' },
          { name: 'saldo', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(dre_uploads)
    }

    // dre_linhas
    let dre_linhas = getCol('dre_linhas')
    if (!dre_linhas) {
      dre_linhas = new Collection({
        name: 'dre_linhas',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'upload_id', type: 'relation', collectionId: dre_uploads.id, maxSelect: 1 },
          { name: 'descricao', type: 'text' },
          { name: 'valor', type: 'number' },
          { name: 'categoria', type: 'text' },
          { name: 'competencia', type: 'text' },
          { name: 'codigo', type: 'text' },
          { name: 'receita', type: 'number' },
          { name: 'despesa', type: 'number' },
          { name: 'ano', type: 'number' },
          { name: 'mes', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_dre_linhas_upload_id ON dre_linhas (upload_id)'],
      })
      app.save(dre_linhas)
    }

    // ala_private_membros
    let ala_private_membros = getCol('ala_private_membros')
    if (!ala_private_membros) {
      ala_private_membros = new Collection({
        name: 'ala_private_membros',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'user_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'nome', type: 'text' },
          { name: 'email', type: 'email' },
          { name: 'telefone', type: 'text' },
          { name: 'status', type: 'text' },
          {
            name: 'tipo',
            type: 'select',
            maxSelect: 1,
            values: ['ALA PRIVATE', 'membro ALA', 'membro ALA PRIVATE WINE', 'Cônjuge', 'Filho'],
          },
          { name: 'data_adesao', type: 'text' },
          { name: 'cargo', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(ala_private_membros)

      const saved_ala = app.findCollectionByNameOrId('ala_private_membros')
      saved_ala.fields.add(
        new RelationField({
          name: 'titular_id',
          collectionId: saved_ala.id,
          maxSelect: 1,
        }),
      )
      app.save(saved_ala)
    } else {
      // Check if titular_id exists
      let saveNeeded = false
      if (!ala_private_membros.fields.getByName('titular_id')) {
        ala_private_membros.fields.add(
          new RelationField({
            name: 'titular_id',
            collectionId: ala_private_membros.id,
            maxSelect: 1,
          }),
        )
        saveNeeded = true
      }

      if (!ala_private_membros.fields.getByName('tipo')) {
        ala_private_membros.fields.add(
          new SelectField({
            name: 'tipo',
            maxSelect: 1,
            values: ['ALA PRIVATE', 'membro ALA', 'membro ALA PRIVATE WINE', 'Cônjuge', 'Filho'],
          }),
        )
        saveNeeded = true
      }
      if (!ala_private_membros.fields.getByName('data_adesao')) {
        ala_private_membros.fields.add(new TextField({ name: 'data_adesao' }))
        saveNeeded = true
      }
      if (!ala_private_membros.fields.getByName('cargo')) {
        ala_private_membros.fields.add(new TextField({ name: 'cargo' }))
        saveNeeded = true
      }
      if (saveNeeded) {
        app.save(ala_private_membros)
      }
    }
  },
  (app) => {
    const getCol = (name) => {
      const variations = [
        name,
        name.toLowerCase(),
        name.toUpperCase(),
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        name
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('_'),
        name
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(''),
        name.replace(/_/g, ''),
      ]
      for (const v of variations) {
        try {
          return app.findCollectionByNameOrId(v)
        } catch (_) {}
      }
      return null
    }

    try {
      const c1 = getCol('ala_private_membros')
      if (c1) app.delete(c1)
    } catch (_) {}

    try {
      const c2 = getCol('dre_linhas')
      if (c2) app.delete(c2)
    } catch (_) {}

    try {
      const c3 = getCol('dre_uploads')
      if (c3) app.delete(c3)
    } catch (_) {}

    try {
      const c4 = getCol('profiles')
      if (c4) app.delete(c4)
    } catch (_) {}
  },
)
