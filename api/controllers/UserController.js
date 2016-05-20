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
          context.status = 'success';
          return res.json(context);
        });
      } catch (err) {
        return res.json(context);
      }
    }
    else
      return res.json(context);
  },

  follow: function (req, res) {
    /*
      user
      following
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        User.findOne({where: {username: data.following}}).exec(function(err, result){
          if(err) throw err;
          data.following = result.id;

          User.findOne({where: {username: data.user}}).exec(function(err, result){
            if(err) throw err;
            result.follow.add(data.following);
            result.save(function(err) {if(err) throw err;});
            context.status = 'success';
            return res.json(context);
          });
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  unfollow: function (req, res) {
    /*
      user
      following
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        User.findOne({where: {username: data.following}}).exec(function(err, result){
          if(err) throw err;
          data.following = result.id;

          User.findOne({where: {username: data.user}}).exec(function(err, result){
            if(err) throw err;
            result.follow.remove(data.following);
            result.save(function(err) {if(err) throw err;});
            context.status = 'success';
            return res.json(context);
          });
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }
};

