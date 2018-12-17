module.exports = app => {

    app.get('/instructions', (req, res) => {
      res.render('instructions.ejs');
    });
  };
  