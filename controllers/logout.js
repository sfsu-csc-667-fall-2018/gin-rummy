module.exports = (app)=> {
       
    app.get('/logout', (req, res)=> {
           
        req.session.destroy()
        res.render('login.ejs', {error: ''})
    })
}