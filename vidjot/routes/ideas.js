const express = require('express');
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();
//Fetching Ideas model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

//loadd Idea create form
router.get('/add', ensureAuthenticated, (request, response) => {
  response.render("ideas/add");
});

// render form to edit Idea
router.get('/edit/:id', ensureAuthenticated, (request, response) => {
  let qry = { _id: new ObjectId(request.params.id), createdBy: request.user.email }
  Idea.findOne(qry).lean()
    .then(idea => {
      if (idea) {
        // console.log('idea', idea);
        response.render("ideas/edit", {
          idea: idea
        });
      }
      else {
        request.flash('error_msg', 'No data found');
        response.redirect('/ideas');
      }

    });

});

//Process form to create Idea
router.post('/', ensureAuthenticated, (request, response) => {
  let errors = [];
  if (!request.body.title) {
    errors.push({ text: 'Please add title' });
  }
  if (!request.body.details) {
    errors.push({ text: 'Please add details' });
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
      details: request.body.details,
      createdBy: request.user.email
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
router.put('/:id', ensureAuthenticated, (request, response) => {
  // console.log('params', request.params);
  const id = request.params.id
  const data = {
    title: request.body.title,
    details: request.body.details,
    updatedBy: request.user.email
  }
  const qry = { _id: new ObjectId(id), createdBy: request.user.email };
  // console.log('update qry', qry);
  // console.log('data', data);
  Idea.findOneAndUpdate(qry, data, { returnDocument: 'after', lean: true })
    .then((idea, err) => {
      if (err) { console.log('updation error', err) }
      // console.log('idea updated ->', idea);
      if (idea) {
        request.flash('success_msg', `Video Idea - ${idea.title} has been updated successfully!`);
        response.redirect('/ideas')
      }
      else {
        request.flash('error_msg', `Invalid request`);
        response.redirect('/ideas')
      }

    });
});

// List Ideas
router.get('/', ensureAuthenticated, (request, response) => {
  console.log('req.user', request.user);
  const query = { createdBy: request.user.email }
  Idea.find(query).lean().sort({ date: 'desc' })
    .then(ideas => {
      console.log('redirected to ideas list');
      // console.log('ideas', ideas, ideas[0]._id.toString());
      response.render('ideas/list', { list: ideas });
    });
});

//Delete an Idea
router.delete('/:id', ensureAuthenticated, (request, response) => {
  // console.log(`Deleting ${request.params.id}`);
  let qry = { _id: new ObjectId(request.params.id), createdBy: request.user.email }
  Idea.findOneAndDelete(qry)
    .then((idea) => {
      if (idea) {
        request.flash('success_msg', 'Video Idea deleted successfully!');
      }
      else {
        request.flash('error_msg', 'Invalid!');
      }
      response.redirect('/ideas');
    });
});

module.exports = router;
