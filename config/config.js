<<<<<<< HEAD
const config = {}

config.PORT = process.env.PORT || 2000

config.host = 'ec2-107-20-211-10.compute-1.amazonaws.com'
config.port = 5432
config.name = 'db2nri7htqji8r'
config.user = 'pqyojbqtfktkul'
config.pass = '260e1926d0ad07604071987177dad8e30e0b381d74a0523c8accc59c10320330'
config.ssl = true

module.exports = config
=======
require('dotenv').config();

module.exports = {

  "development": {
    "use_env_variable": "DATABASE_URL",
     "dialect": "postgres"

                 },

"test":    {
"use_env_variable": "DATABASE_URL",
"dialect": "postgres"
          },

"production": {
"use_env_variable": "DATABASE_URL",
"dialect": "postgres"
}


}
>>>>>>> 73b3b9f099078257119987549f22be35a457de33
