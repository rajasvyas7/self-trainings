const LocalStrategy = require('passport-local').Strategy;
const mongoose =  require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');
module.exports = function(passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email'}, 
    (email, password, done) => {
      //Match email
      User.findOne({email: email})
        .then( (user) => {
          if (!user) {
            return done(null, false, {message: 'Incorrect Email or Password.'});
          }

          //match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {throw err}
            if (!isMatch) {
              return done(null, false, {message: 'Incorrect Email or Password.'});
            }
            else {
              console.log('User Authenticated');
              return done(null, user);
            }
          })
        });
    }
  ));

  passport.serializeUser((user, done) => {
    console.log('serializeUser called');
    return done(null, user.id)
  });

  passport.deserializeUser((id, done) => {
    console.log('DeserializeUser called', id);
    User.findById(id)
      .then((user, err) => {
        // console.log('deserialise error', err);
        // console.log('deserialise user', user);
        return done(err, user);
      }); 
  })

}