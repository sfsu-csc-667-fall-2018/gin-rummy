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
const index = require('./routes/index')(db,io)
const lobby = require('./routes/lobby')(db, io)
const game = require('./routes/game')(db, io)

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


