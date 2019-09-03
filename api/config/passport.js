const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
const User = require("../models/user");

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SESSION || "amoeba";

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, function(jwtPayload, done) {
      User.findOne({
        email: jwtPayload.email,
        name: jwtPayload.name
      })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          return done(err, false);
        });
    })
  );
};
