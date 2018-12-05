module.exports = app => {

  app.get('/scoreboard', (req, res) => {
    res.render('scoreboard.ejs');
  });
};
