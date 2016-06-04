/**
 * TweetController
 *
 * @description :: Server-side logic for managing Tweet
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new_tweet: function (req, res) {
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
          context.post = created;
          context.post.user = req.user;
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

  update_tweet: function (req, res) {
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
  },

  tag_search: function (req, res) {
    /*
      tag
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        Tweet.find({text: {contains: data.tag}}).exec(function(err, result){
          if(err) throw err;
          context.result = result;
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

  following_posts: function (req, res){
    var context = {};
    context.status = 'error';

    try {
      data = {};
      data.user = req.user.id;

      User.findOne({where: {id: data.user}}).populate('follow').exec(function(err, result){
        if(err) throw err;
        var ids = [req.user.id];
        for (var i in result.follow){
          ids.push(result.follow[i].id);
        }

        Tweet.find({user: ids}).populate('user').sort('createdAt DESC').exec(function(err,result) {
          if(err) throw err;
          context.result = result;
          context.status = 'success';
          return res.json(context);
        });
      });
    } catch (err) {
      return res.json(context);
    }
  },

  my_tweets: function (req, res){
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        Tweet.find({user: data.user}).populate('user').sort('createdAt ASC').exec(function(err,result) {
          if(err) throw err;
          context.result = result;
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
  tweets_from_user: function (req, res){
    /* 
      user
    */
    var context = {};
    context.status = 'error';

    //console.log(req.body);

    var data = (req.body) ? req.body : undefined;
    console.log(data);
    if (data) {
      try {
        User.findOne({"username": data.user}).exec(function(err, result){
          console.log("aqui");
          if(err) throw err;
          console.log(result);
          Tweet.find({user: result.id}).populate('user').sort('createdAt ASC').exec(function(err,result) {
            if(err) throw err;
            context.result = result;
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

  /*delete_tweet: function (req,res){
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
              Tweet.destroy({where: {id: result.id}}).exec(function (err){
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
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }*/
};
