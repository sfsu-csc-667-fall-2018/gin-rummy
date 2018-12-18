<<<<<<< HEAD
 // dependencies
const config = require('./config/config')
const express = require('express')
const http = require('http')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const io = require('socket.io')()
const pgp = require('pg-promise')()
var ejs = require('ejs');

const app = express()
const server = http.createServer(app)

// init io and attach to server

app.io = io
io.listen(server)
server.listen(config.PORT)

// connection object to remote db


const connection = {
  host: config.host,
  port: config.port,
  database: config.name ,
  user: config.user,
  password: config.password,
  ssl: config.ssl
}

const db = pgp(process.env.DATABASE_URL || connection)

//routes
const index = require('./controllers/index')(db,io)
const lobby = require('./controllers/lobby')(db, io)
const game = require('./controllers/game')(db, io)

// view engine setup using ejs templating engine

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middlewares for all routes

app.use(logger('dev')) // logger
app.use(bodyParser.json()) // url parser for json objects
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public'))) // serve static public dir

// controllers 

app.use('/', index)
app.use('/login', index)
app.use('/logout', index)
app.use('/content', index)
app.use('/game', game)
app.use('/lobby', lobby)
app.use('/rule', index)
app.use('/about', index)


=======
 


const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const pgp = require('pg-promise')()

// const cn = {
//     host: 'ec2-107-20-211-10.compute-1.amazonaws.com',
//     port: 5432,
//     database: 'db2nri7htqji8r',
//     user: 'pqyojbqtfktkul',
//     password: '260e1926d0ad07604071987177dad8e30e0b381d74a0523c8accc59c10320330'
// };

const db = pgp('postgres://pqyojbqtfktkul:260e1926d0ad07604071987177dad8e30e0b381d74a0523c8accc59c10320330@ec2-107-20-211-10.compute-1.amazonaws.com:5432/db2nri7htqji8r?ssl=true')
//db.connect()





// middleware setups


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// view engine 'EJS' setup

app.set('view engine', 'ejs')







// Controllers


require('./controllers/home.js')(app)


app.get('/tests', (req, res)=> {

db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
{Date.now()}')`)
.then( _ => db.any(`SELECT * FROM test_table`) )
.then( results => res.json( results ) )
.catch( error => {

	console.log(error)
})

})










// server start


app.listen(process.env.PORT || 2000, () => {

	  console.log ('Server Running ....')
})
>>>>>>> 73b3b9f099078257119987549f22be35a457de33
