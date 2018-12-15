module.exports = (app)=> {
      

    app.post('/game/:id', (req, res)=> {


         if(!req.session.user)
         res.render('login.ejs', {error: ''})
           else
           res.render('game.ejs', {username: req.session.user})
    })
}