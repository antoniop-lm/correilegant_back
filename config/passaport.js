var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id } , function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {

    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (password == user.password) {
        var returnUser = {
          username: user.username,
          id: user.id
        };
        return done(null, returnUser, {
          message: 'Logged In Successfully'
        });

      } else {
        return done(null, false, {
          message: 'Invalid Password'
        });
      }

    });
  }
));
