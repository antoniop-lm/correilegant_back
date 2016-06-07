/**
 * ReactionController
 *
 * @description :: Server-side logic for managing Reaction
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  set_reaction: function (req, res) {
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

        Tweet.findOne({id: data.tweet}).exec(function(err, result_tweet){
          if(err) throw err;
          if(result_tweet){
            Reaction.findOne({tweet: result_tweet.id, user: data.user}).exec(function(err, result_reaction){
              //console.log(result_reaction);
              if(result_reaction != null) {
                if(result_reaction.rate == data.rate){
                  Reaction.destroy({where: {user: data.user, tweet: result_tweet.id}}).exec(function(err){
                    if(err) throw err;
                    context.status = 'success';
                    return res.json(context);
                  });
                } else {
                  Reaction.update(result_reaction.id, data).exec(function (err, updated){
                    if(err) throw err;
                    context.status = 'success';
                    return res.json(context);
                  });
                }
              } else { 
                Reaction.create(data).exec(function(err, created){
                  if(err) throw err;
                  context.status = 'success';
                  return res.json(context);
                });
              }
            });
          }
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  my_reaction: function (req, res) {
    /*
      tweet
      user
    */
    var context = {};
    context.status = 'error';

    var data = (req.params) ? req.params : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Reaction.findOne({where: {user: data.user, tweet: data.id}}).exec(function(err, found){
          context.found = found;
          console.log(found);
          if(err) throw err;
            context.status = 'success';
            return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }
};
