migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'johnnyoliveira@gmail.com')
      record.setPassword('#Ortabla6!')
      record.setVerified(true)
      app.save(record)
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('johnnyoliveira@gmail.com')
    record.setPassword('#Ortabla6!')
    record.setVerified(true)
    record.set('name', 'Johnny Oliveira')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'johnnyoliveira@gmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
