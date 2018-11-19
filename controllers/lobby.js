module.exports = (app)=> {
       

    app.get('/lobby', (req, res)=> {
            
        if(req.session.user)
          res.render('lobby.ejs', {username:req.session.user})
          else
          res.render('register.ejs', {error: ''})
    })
}