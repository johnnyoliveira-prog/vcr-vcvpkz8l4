migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'johnnyoliveira@gmail.com')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('johnnyoliveira@gmail.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Admin')
    app.save(record)

    // Seed profile
    const profiles = app.findCollectionByNameOrId('profiles')
    const profileRecord = new Record(profiles)
    profileRecord.set('user', record.id)
    profileRecord.set('name', 'Admin')
    profileRecord.set('email', 'johnnyoliveira@gmail.com')
    profileRecord.set('role', 'admin')
    profileRecord.set('allowed_routes', ['*'])
    app.save(profileRecord)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'johnnyoliveira@gmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
