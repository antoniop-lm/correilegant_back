/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function (req, res) {
    /*
      name
      username
      description
      password
      birthday
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        User.create(data).exec(function createCB(err, created){
          if(err) throw err;
          console.log('Created user with name ' + created.name);
        });
        context.status = 'success';
      } catch (err) {}
    }
    return res.json(context);
  }
};

