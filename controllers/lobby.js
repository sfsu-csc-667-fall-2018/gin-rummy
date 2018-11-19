module.exports = (app)=> {
       

    app.get('/lobby', (req, res)=> {
          
          res.render('lobby.ejs')
    })
}