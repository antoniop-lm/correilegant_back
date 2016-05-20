/**
 * TweetController
 *
 * @description :: Server-side logic for managing Tweet
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function (req, res) {
    /*
      user
      title
      text
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

          Tweet.create(data).exec(function createCB(err, created){
            if(err) throw err;
            context.status = 'success';
            return res.json(context);
          });
        });
      } catch (err) {
        return res.json(context);
      }
    }
    else
      return res.json(context);
  },

  retweet: function (req,res) {
    /*
      user
      outro
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

          Tweet.create(data).exec(function createCB(err, created){
            if(err) throw err;
            context.status = 'success';
            return res.json(context);
          });
        });
      } catch (err) {
        return res.json(context);
      }
    }
    else
      return res.json(context);

  }
};

