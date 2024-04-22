const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

//DB connection
mongoose.connect('mongodb://localhost:27017/vidjot-dev')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

//Fetching Ideas model
require('./models/Ideas');
const Idea = mongoose.model('ideas');

//Handlebars middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Module override middle were
// app.use(methodOverride('_method'));

//Routes
app.get('/', (request, response) => {
  const title = 'Welcome Rajas'
  response.render("index", {
    title: title
  });
});

app.get('/about', (request, response) => {
  response.render("about");
});

app.get('/ideas/add', (request, response) => {
  response.render("ideas/add");
});

app.get('/ideas/edit/:id', (request, response) => {
  Idea.findById(request.params.id).lean()
    .then(idea => {
      // console.log('idea', idea);
      response.render("ideas/edit", {
        idea: idea
      });
    });
  
});

//Process form
app.post('/ideas', (request, response) => {
  let errors = [];
  if(!request.body.title) {
    errors.push({text: 'Please add title'});
  }
  if(!request.body.details) {
    errors.push({text: 'Please add details'});
  }

  if (errors.length > 0) {
    response.render('ideas/add', {
      errors: errors,
      title: request.body.title,
      details: request.body.title
    })
  }
  else {
    let data = {
      title: request.body.title,
      details: request.body.details
    }
    new Idea(data).save()
      .then((idea) => {
        response.redirect('/ideas');
      })
      .catch();
  }
});

// Update an idea
app.post('/ideas/update/:id', (request, response) => {
  console.log('params', request.params);
  const id = request.params.id
  const data = {
    title: request.body.title,
    details: request.body.details
  }
  console.log('data', data);
  Idea.findByIdAndUpdate(id, data, {returnDocument: 'after', lean: true})
    .then((idea) => {
      console.log('idea', idea);
      response.redirect('/ideas')
    });
  // response.send('Jhumritallaiya!')
});

app.get('/ideas', (request, response) => {
  Idea.find({}).lean().sort({date: 'desc'})
    .then(ideas => {
      // console.log('ideas', ideas, ideas[0]._id.toString());
      response.render('ideas/list', {list: ideas});    
    });
});

const port = 7000;
app.listen(port, () => {
  console.log(`Node server running on port #${port}`);
});
//sample comment