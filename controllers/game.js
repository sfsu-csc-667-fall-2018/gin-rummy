module.exports = (app)=> {
      

    app.post('/game/:id', (req, res)=> {

        console.log("GAMEEEEEEEE")

         if(!req.session.user)
         res.render('login.ejs', {error: ''})
           else
           res.render('game.ejs', {username: req.session.user})
    })
}