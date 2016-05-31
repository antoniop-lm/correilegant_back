/**
 * TweetController
 *
 * @description :: Server-side logic for managing Tweet
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function (req, res) {
    /*
      title
      text
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Tweet.create(data).exec(function createCB(err, created){
          if(err) throw err;
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

  retweet: function (req,res) {
    /*
      retweet
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;
        Tweet.findOne({where: {id: data.retweet}}).exec(function(err, result){
          if(err) throw err;
          if(result){
            data.retweet = result.id;
            Tweet.create(data).exec(function createCB(err, created){
              if(err) throw err;
              context.status = 'success';
              return res.json(context);
            });
          }else
            return res.json(context);

        });
      } catch (err) {
        return res.json(context);
      }
    }
    else
      return res.json(context);

  },

  updatetweet: function (req, res) {
    /*
      id
      title
      text
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        Tweet.findOne({where: {id: data.id}}).exec(function(err, result){
          if(err) throw err;
          if(result){
            if(result.user == req.user.id){
              Tweet.update(result.id, data).exec(function (err, updated){
                if(err) throw err;
                context.status = 'success';
                return res.json(context);
              });
            }
            else
              return res.json(context);
          }
          else
            return res.json(context);
        });
      } catch (err) {
        return res.json(context);
      }
    }
    else
      return res.json(context);
  }
};

