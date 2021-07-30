const pgp = require('pg-promise')()

const username = 'postgres'
const password = 'Appaminded_420'
const host = 'localhost'
const port = 5432
const database = 'mrcoffee'

const connection = `postgres://${username}:${password}@${host}:${port}/${database}`

const db = pgp(connection)

module.exports = db