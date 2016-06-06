/**
 * ReactionController
 *
 * @description :: Server-side logic for managing Reaction
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new_reaction: function (req, res) {
    /*
      tweet
      rate
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Reaction.create(data).exec(function(err, created){
          if(err) throw err;
          context.status = 'success';
          return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  update_reaction: function (req,res) {
    /*
      tweet
      rate
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Reaction.findOne({where: {user: data.user, tweet: data.tweet}}).exec(function(err, result){
          if(err) throw err;
          if(result){
            Reaction.update(result.id, data).exec(function (err, updated){
              if(err) throw err;
              context.status = 'success';
              return res.json(context);
            });
          } 
          else
            return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  my_reaction: function (req,res) {
    /*
      tweet
      user
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body) ? req.body : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Reaction.findOne({where: {user: data.user, tweet: data.tweet}}).exec(function(err, result){
          if(err) throw err;
            context.status = 'success';
            return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  delete_reaction: function (req,res) {
    /*
      tweet
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Reaction.destroy({where: {user: data.user, tweet: data.tweet}}).exec(function(err){
          if(err) throw err;
          context.status = 'success';
          return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },
};
