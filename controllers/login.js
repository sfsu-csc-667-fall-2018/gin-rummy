module.exports = (app, con, loginUser)=> {
        
         app.get('/login', (req, res)=> {
                 
            res.render('login.ejs', {error: ''})
         })



         app.post('/login', (req, res)=> {

            let username = req.body.username
            let password = req.body.password
                
            const loginPromise =  loginUser(con, username, password)

            loginPromise.then(results=> {
                  
                    if (results.status ==='success') {
                          
                        res.render('lobby.ejs')
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