const pgp = require('pg-promise')()
const db = pgp('postgres://pqyojbqtfktkul:260e1926d0ad07604071987177dad8e30e0b381d74a0523c8accc59c10320330@ec2-107-20-211-10.compute-1.amazonaws.com:5432/db2nri7htqji8r?ssl=true')
module.exports = db