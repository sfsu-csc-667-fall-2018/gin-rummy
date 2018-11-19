module.exports = (app, con, authenticate, register)=> {
       

    app.get('/register', (req, res)=> {
           
          res.render('register.ejs', {error: ''})
    })


    app.post('/register', (req, res)=> {
           
          let username = req.body.username
          let password = req.body.password

        const authPromise = authenticate(con, username)
        authPromise.then((result)=> {
            if(result.status === 'success'){
            register(con, username, password)
            res.render('lobby.ejs')
            }
            else {
            res.render('register.ejs', {error: 'username already exists'})
            }        
        })
        .catch((error)=> {
              console.log(error)
        })
    })

}