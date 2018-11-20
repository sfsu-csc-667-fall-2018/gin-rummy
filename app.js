 


const express = require('express')

const app = express()

const session = require('express-session')

const bodyParser = require('body-parser')

const pgp = require('pg-promise')()

const db = pgp('postgres://pqyojbqtfktkul:260e1926d0ad07604071987177dad8e30e0b381d74a0523c8accc59c10320330@ec2-107-20-211-10.compute-1.amazonaws.com:5432/db2nri7htqji8r?ssl=true')

var http = require('http').createServer(app);

var io = require('socket.io')(http);

var ejs = require('ejs');
//db.connect()





// middleware setups


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({ secret: 'secret_word', resave: false,
  saveUninitialized: true, cookie: {expires: false}}))


// view engine 'EJS' setup

app.set('view engine', 'ejs')




//models


const authenticate = require('./models/authenticate')
const register = require('./models/register')
const login = require('./models/login')


// Controllers


require('./controllers/home')(app)
require('./controllers/register')(app, db, authenticate, register)
require('./controllers/login')(app, db, login)
require('./controllers/lobby')(app)
require('./controllers/logout')(app)







app.get('/tests', (req, res)=> {

db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
{Date.now()}')`)
.then( _ => db.any(`SELECT * FROM test_table`) )
.then( results => res.json( results ) )
.catch( error => {

	console.log(error)
})

})



app.get('/create', (req, res)=> {

	  db.any(`create table test_table ("id" serial PRIMARY KEY, "createdAt" date not null default CURRENT_DATE, "testString" VARCHAR(255) not null)`)
	  .then( results => res.json(results))
	  .catch(error => {
	  	console.log(error)

	  })	
})


app.get('/players', (req, res)=> {


	  db.any(`create table players 
	  	("player_id" serial PRIMARY KEY,
	  	 "points"  INT,
	  	 "username" VARCHAR(255) not null,
	  	 "password" VARCHAR(255) not null, 
	  	 "wins" INT)
	  	`)
	  .then( results => res.send(results))
	  .catch(error => {

	  	  console.log(error)
	  })
})





app.get('/cards', (req, res) => {

	   db.any(`create table cards
	   	("card_id" serial PRIMARY KEY, 
	   	"suit" text not null,
	   	"rank" INT not null)`)
	   .then(results=> res.send(results))
	   .catch(error => {
	   	   console.log(error)
	   })
})

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('chat message',function(msg) {
		let message = msg.username + ": " + msg.val
		console.log("msg: " + message)
		io.emit('chat message',message);
	})
	socket.on('disconnect', function() {
		console.log('a user disconnected');
	});
});













// server start


http.listen(process.env.PORT || 2000, () => {

	  console.log ('Server Running ....')
})
