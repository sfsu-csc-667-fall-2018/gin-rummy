const express = require('express');

const app = express();

const bodyParser = require('body-parser');



// middleware setups


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// view engine 'EJS' setup

app.set('view engine', 'ejs')







// Controllers


require('./controllers/home.js')(app)














// server start


app.listen(process.env.PORT || 2000, () => {

	  console.log ('Server Running ....')
})
