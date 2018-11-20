 


const express = require('express')

const app = express()

const session = require('express-session')

const bodyParser = require('body-parser')

const http = require('http')

const db = pgp('postgres://pqyojbqtfktkul:260e1926d0ad07604071987177dad8e30e0b381d74a0523c8accc59c10320330@ec2-107-20-211-10.compute-1.amazonaws.com:5432/db2nri7htqji8r?ssl=true')

var http = require('http').createServer(app);

var io = require('socket.io')(http);

var ejs = require('ejs');
//db.connect()

const db = require('./config/config')

const path = require('path')



// middleware setups


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({ secret: 'secret_word', resave: false,
saveUninitialized: true, cookie: {expires: false}}))
app.use(express.static(path.join(__dirname, 'assets'))); 



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
require('./controllers/chat')(app)
require('./controllers/game')(app)


// Classes

let Card = require('./Classes/Card')
let Deck = require('./Classes/Deck')
let deck = new Deck()

for (let i=0; i < 4; i++) {
	 
	console.log(i)

	for (let j = 1; j <= 13; j++) {
		  
		if (i === 0) {
			 
			let suit = "spade"
			let card = new Card(j, suit)
			deck.addCard(card)
		}

		if (i ===1) {
			 
			let suit = "diamond"
			let card = new Card(j,suit)
			deck.addCard(card)

		}

		if (i === 2) {
			let suit = "heart"
			let card = new Card(j,suit)
			deck.addCard(card)

		}

		if (i === 3) {
			let suit = "club"
			let card = new Card(j,suit)
			deck.addCard(card)


		}
	}
}

console.log(deck.getDeck())

// 



const server = http.createServer(app)

let io = socketIO(server)

let socketCount = 0


io.sockets.on('connection', (socket)=> {
	   
	console.log('new user connected')
	socketCount++

	socket.on('newUser', ()=> {

		console.log(socketCount)

		if(socketCount >= 2) {
			  
			io.sockets.emit('game_start')
		}

	})

	socket.on('disconnect', ()=> {
		  
		console.log('user disconnected ....')

		socketCount--
	})

})

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


server.listen(process.env.PORT || 2000, () => {

	  console.log ('Server Running ....')
})
