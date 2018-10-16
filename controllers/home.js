

const home = (app) => {

	   app.get('/', (req, res) => {

	   	     res.render('home')
	   })
}

module.exports = home