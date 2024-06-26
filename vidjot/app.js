const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');

const ideasRoutes = require('./routes/ideas');
const usersRoutes = require('./routes/users')
const db = require('./config/database');

require('./config/passport')(passport);

const app = express();

//DB connection
mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

//Handlebars middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Module override middle were
app.use(methodOverride('_method'));

//session middleware
app.use(session({
  secret: 'terenaam',
  resave: true,
  saveUninitialized: true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware 
app.use(flash()); 

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//global varibales
app.use((request, response, next) => {
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error');
  response.locals.user = request.user || null;
  next();
});

//Routes
app.use('/ideas', ideasRoutes);
app.use('/users', usersRoutes);

app.get('/', (request, response) => {
  const title = 'Welcome to the App'
  response.render("index", {
    title: title
  });
});

app.get('/about', (request, response) => {
  response.render("about");
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Node server running on port #${port}`);
});
//sample comment