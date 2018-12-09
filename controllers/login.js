module.exports = (app, con, loginUser)=> {
        
         app.get('/login', (req, res)=> {

            if(!req.session.user)
                res.render('login.ejs', {error: ''})
                else
                //res.render('lobby.ejs', {username: req.session.user})
                res.render('game.ejs', {username: req.session.user})
         })



         app.post('/login', (req, res)=> {

            let username = req.body.username
            let password = req.body.password
                
            const loginPromise =  loginUser(con, username, password)

            loginPromise.then(results=> {
                  
                    if (results.status ==='success') {

                        req.session.user = username
                          
                        console.log('user' + req.session.user)
                        res.render('lobby.ejs', {username: req.session.user})
                    }

                    else {
                          
                        res.render('login.ejs', {error: 'username and passwords dont match'})
                    }
            })

            .catch(error=> {
                   
                console.log(error)
            })
         })
}