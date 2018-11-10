

const lobby = (app) => {

	   app.get('/lobby', (req, res) => {

	   	     res.render('lobby')
	   })
}

module.exports = lobby