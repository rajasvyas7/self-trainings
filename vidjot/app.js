const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//DB connection
mongoose.connect('mongodb://localhost:27017/vidjot-dev')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

//Fetching Ideas model
require('./models/Ideas');
mongoose.model('ideas');

//Handlebars middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (request, response) => {
  const title = 'Welcome Rajas'
  response.render("index", {
    title: title
  });
});

app.get('/about', (request, response) => {
  response.render("about");
});

const port = 7000;
app.listen(port, () => {
  console.log(`Node server running on port #${port}`);
});