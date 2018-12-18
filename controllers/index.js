module.exports = function(db, io) {
    const express = require('express'),
    router = express.Router(),
    session = require('express-session');
    
    //express  sesssion to maintain user session after login
    router.use(session({
      secret: 'anything',
      resave: true,
      saveUninitialized: true
    }));
    const path = require('path')
  
    let username
  
    router.use(express.static('public', {'root': './'}))
  
    const dbjs = require('./database')
    const database = new dbjs(db)

    // middlewre for user authentication
  
    const auth = function(request, response, next) {
  
      if (request.session && (request.session.user === username) && request.session.admin)
      {
        return next();
      }
      else
      {
        return response.render('login.ejs', {error: ''});
      }
    };
  
    // home page route, redirect to lobby if logged in

    router.get('/', function (request, response) {
      response.redirect('/lobby');
    });
  
    // login page, redirect to lobby if logged in 
    router.get('/login', auth, function(request, response, next) {
      response.redirect('/lobby');
    });
  
    // login post route

    // change to render the login page with {error: ''}

    router.post('/login', function (request, response) {
      if (!request.body.username || !request.body.password) {
        if(!request.session.user === username) {
          response.send('login failed');
        }
      }
      else {
        checkPlayerExists(request, response)
      }
    });
  
    // register get route
    router.get('/register', function (request, response) {
      response.render('register',{ error: false});
    });
  
    // post route for register
    
    //todo
    // send error message {error: ''} to the register page's get route
    
    router.post('/register', function (request, response) {
      database.registerNewUser(request,response)
      .then((result) => {
        database.createScoreboard(result.player_id)
        .then(() => {
          response.redirect('/login');
        })
      })
      .catch((err) => {
        response.render('register',{ error: true});
      })
    });
  
    // destroy session at logout endpoint

    router.get('/logout', function (request, response) {
      database.deleteGamePlayerByPlayerId(request.session.player_id)
      request.session.destroy();
      response.render('login', {error: ''});
    });
  
    
  
    // helper functions


    // check if player exists

    // error message sent to login page
  
  
    function checkPlayerExists(request, response)
    {
        database.checkPlayerExists(request,response)
        .then((data) => {      
          username  = request.body.username;
          request.session.user = request.body.username;
          request.session.admin = true;
          request.session.player_id = data.player_id;
  
        response.redirect('/lobby');
     })
     .catch( error=> {
          
      return response.render('login.ejs', {error: 'wrong username or password'})
  
     })
    
     
    }
  
    return router;
  }