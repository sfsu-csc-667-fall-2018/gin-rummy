 


const express = require('express')

const app = express()

const session = require('express-session')

const bodyParser = require('body-parser')



const http = require('http')

const socketIO = require('socket.io')

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
require('./controllers/scoreboard')(app)
require('./controllers/chat')(app)
require('./controllers/game')(app)


// Classes

let Card = require('./Classes/Card')
let Deck = require('./Classes/Deck')
let Game = require('./Classes/Game')
let Player = require('./Classes/Player')
let ChatBox = require('./Classes/ChatBox')

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


let game = new Game ();





const server = http.createServer(app)

let io = socketIO(server)
new ChatBox('/lobby', io)
new ChatBox('/game', io)










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


// server start


server.listen(process.env.PORT || 2000, () => {

	  console.log ('Server Running ....')
})
