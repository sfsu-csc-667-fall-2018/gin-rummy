 


const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const pgp = require('pg-promise')();

var http = require('http').Server(app);

var io = require('socket.io')(http);

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

//app.set('view engine', 'ejs')







// Controllers


//require('./controllers/home.js')(app)

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/views/home.html');
});

require('./controllers/home.js')(app)
require('./controllers/lobby.js')(app)

/*app.get('/tests', (req, res)=> {

db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
{Date.now()}')`)
.then( _ => db.any(`SELECT * FROM test_table`) )
.then( results => res.json( results ) )
.catch( error => {

	console.log(error)
})

});*/

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('chat message',function(msg) {
		io.emit('chat message', msg);
	})
	socket.on('disconnect', function() {
		console.log('a user disconnected');
	});
});

// server start

http.listen(process.env.PORT || 2000, () => {

	  console.log ('Server Running ....')
})
