module.exports = function(req, res, next) {
 if (req.isAuthenticated()) {
    return next();
  }
  else{
    return res.send(401, {err: 'E_LOGIN_REQUIRED', message: 'Login required'});
  }
};
