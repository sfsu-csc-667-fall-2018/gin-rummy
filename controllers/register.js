module.exports = (app, con, authenticate, register)=> {
       

    app.get('/register', (req, res)=> {
           
          res.render('register.ejs')
    })


    app.post('/register', (req, res)=> {
           
          let username = req.body.username
          let password = req.body.password

        const authPromise = authenticate(con, username)

        
        console.log("AUTH ===== " + authPromise)

        authPromise.then((result)=> {
              
            res.send(result)
        })

        .catch((error)=> {
              
            res.send(error)
        })
    })

}