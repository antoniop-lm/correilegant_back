/**
 * ReactionController
 *
 * @description :: Server-side logic for managing Reaction
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function (req, res) {
    /*
      user
      tweet
      value
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        User.findOne({where: {username: data.user}}).exec(function(err, result){
          if(err) throw err;
          data.user = result.id;

          Reaction.create(data).exec(function(err, created){
            if(err) throw err;
            context.status = 'success';
            return res.json(context);
          });
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }
};

