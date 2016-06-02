/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  eu: function (req, res) {
    var context = {};
    context.status = 'error';

    try{
      User.findOne(req.user.id).populate("tweet_set").exec(function(err, found){
        if(err) throw err;
        context.user = found;
        context.status = 'success';
        res.json(context);
      });
    } catch(err){
      res.json(context);
    }
  },

  details: function (req, res) {
    var context = {};
    context.status = 'error';
    try {
      User.findOne({"username" : req.param("id")}).exec(function(err, found){
        if (err) throw err;
        context.user = found;
        console.log(found);
        context.status = 'success';
        res.json(context);
      });
    } catch(err){
      res.json(context);
    }
  },

  new_user: function (req, res) {
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
          if(result){
            data.following = result.id;

            result = req.user;
            result.follow.add(data.following);
            result.save(function(err) {
              if(err) throw err;
              context.status = 'success';
              return res.json(context);
            });
          } else
            return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  unfollow: function (req, res) {
    /*
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
          if(result){
            data.following = result.id;

            result = req.user;
            result.follow.remove(data.following);
            result.save(function(err) {
              if(err) throw err;
              context.status = 'success';
              return res.json(context);
            });
          } else
            return res.json(context); 
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  search_user: function(req,res) {
    /*
      user
    */
    var context = {};
    context.status = "error";

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        User.find({username: {contains: data.user}}).exec(function(err, result){
          if(err) throw err;
          if(result){
            context.result = result;
            context.status = 'success';
            return res.json(context);
          } else
            return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  update_user: function (req, res) {
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
        User.findOne({where: {username: data.username}}).exec(function(err, result){
          if(err) throw err;
          if(result){
            User.update(result.id, data).exec(function (err, updated){
              if(err) throw err;
              console.log('Updated user with name ' + updated.name);
              context.status = 'success';
              return res.json(context);
            });
          } 
          else
            return res.json(context);
        });
      } catch (err) {
        return res.json(context);
      }
    }
  
  },

  /*delete_user: function (req,res){
    
    var context = {};
    context.status = 'error';

    console.log(req.user.id);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;
        req.logout();
        User.destroy({where: {id: data.user}}).exec(function(err){
          if(err) throw err;
          //res.redirect('/');
          context.status = 'success';
          return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }*/
};

