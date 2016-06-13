/**
 * AuthControllerController
 *
 * @description :: Server-side logic for managing Authcontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function(req, res) {
    /*
      Requisitos: -
      Paramêtros: username, password
      Saida: -

      Realiza a autenticação do usuário passado como parâmetro. A senha oviamente deve ser a cadastrada.
    */
    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        return res.send({
          message: info.message,
          user: user
        });
      }
      req.logIn(user, function(err) {
        if (err) res.send(err);
        return res.send({
          message: info.message,
          user: user
        });
      });

    })(req, res);
  },

  logout: function(req, res) {
    /*
      Requisitos: Estar logado
      Paramêtros: -
      Saida: -

      Realiza o logout do usuário logado, é retorna para o início.
    */
    req.logout();
    res.redirect('/');
  }
};
