const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
//Fetching Ideas model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

//loadd Idea create form
router.get('/add', (request, response) => {
  response.render("ideas/add");
});

// render form to edit Idea
router.get('/edit/:id', (request, response) => {
  Idea.findById(request.params.id).lean()
    .then(idea => {
      // console.log('idea', idea);
      response.render("ideas/edit", {
        idea: idea
      });
    });
  
});

//Process form to create Idea
router.post('/', (request, response) => {
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
        request.flash('success_msg', `Video Idea - ${idea.title} created successfully!`);
        response.redirect('/ideas');
      })
      .catch();
  }
});

// Update an idea
// app.post('/ideas/update/:id', (request, response) => {
router.put('/:id', (request, response) => {
  console.log('params', request.params);
  const id = request.params.id
  const data = {
    title: request.body.title,
    details: request.body.details
  }
  console.log('data', data);
  Idea.findByIdAndUpdate(id, data, {returnDocument: 'after', lean: true})
    .then((idea) => {
      request.flash('success_msg', `Video Idea - ${idea.title} has been updated successfully!`);
      response.redirect('/ideas')
    });
  // response.send('Jhumritallaiya!')
});

// List Ideas
router.get('/', (request, response) => {
  Idea.find({}).lean().sort({date: 'desc'})
    .then(ideas => {
      // console.log('ideas', ideas, ideas[0]._id.toString());
      response.render('ideas/list', {list: ideas, http: JSON.stringify(this.http)});    
    });
});

//Delete an Idea
router.delete('/:id', (request, response) => {
  console.log(`Deleting ${request.params.id}`);
  Idea.findByIdAndDelete(request.params.id)
    .then((idea) => {
      request.flash('success_msg', 'Video Idea deleted successfully!');
      response.redirect('/ideas');
    });
});

module.exports = router;
