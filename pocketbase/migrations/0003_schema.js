migrate(
  (app) => {
    // profiles
    let profiles
    try {
      profiles = app.findCollectionByNameOrId('profiles')
    } catch (_) {
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
    let dre_uploads
    try {
      dre_uploads = app.findCollectionByNameOrId('dre_uploads')
    } catch (_) {
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
    let dre_linhas
    try {
      dre_linhas = app.findCollectionByNameOrId('dre_linhas')
    } catch (_) {
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
    let ala_private_membros
    try {
      ala_private_membros = app.findCollectionByNameOrId('ala_private_membros')
    } catch (_) {
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

      ala_private_membros.fields.add(
        new RelationField({
          name: 'titular_id',
          collectionId: ala_private_membros.id,
          maxSelect: 1,
        }),
      )
      app.save(ala_private_membros)
    }
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('ala_private_membros'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('dre_linhas'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('dre_uploads'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('profiles'))
    } catch (_) {}
  },
)
