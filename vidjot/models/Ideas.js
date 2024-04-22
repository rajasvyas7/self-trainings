const mongoose =  require('mongoose');

const Schema =  mongoose.Schema;

const IdeaSchema = new Schema({
  title: {type: String, required: true},
  details: {type: String, required: true},
  createdBy: {type: String, required: false},
  updatedBy: {type: String, required: false},
  date: {type: Date, default: Date.now}
});

mongoose.model('ideas', IdeaSchema);