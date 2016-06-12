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
    console.log(data);
    if (data) {
      newData = {};
      newData.title = data.title;
      newData.text = data.text;
      try {
        Tweet.findOne({where: {id: data.id}}).exec(function(err, result){
          if(err) throw err;
          if(result){
            if(result.user == req.user.id){
              Tweet.update(result.id, newData).exec(function (err, updated){
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
    
      try {
        Tweet.find({text: {contains: req.param("id")}}).exec(function(err, result){
          if(err) throw err;
          context.result = result;
          context.status = 'success';
          return res.json(context);
        });
      } catch (err) {
        return res.json(context);
      }
   
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

        Tweet.find({user: ids}).populate('user').populate('retweet').sort('createdAt DESC').exec(function(err,result) {
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

        Tweet.find({user: data.user}).populate('user').populate('retweet').sort('createdAt ASC').exec(function(err,result) {
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
          Tweet.find({user: result.id}).populate('user').populate('retweet').sort('createdAt ASC').exec(function(err,result) {
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
  },

  delete_tweet: function (req,res){
    /*
      id
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
  },

  //impact = (número total de replicações * 5) + (número total delikes * 3) - número total de dislikes
  tweet_top20: function (req,res){
    /*
      date_ini
      date_end
    */
    var context = {};
    context.status = 'error';

    //console.log(req.body);

    var initialize_values = function (tweet_set) {
      for(var i = 0; i < tweet_set.length; i++){
        tweet_set[i].number_likes = 0;
        tweet_set[i].number_dislikes = 0;
        tweet_set[i].number_retweets = 0;
      }
      return tweet_set;
    }

    var likes_sum = function (tweet_set) {
      var sum = 0;
      if(tweet_set.reactions){
        for (var j = 0; j < tweet_set.reactions.length; j++){
          if (tweet_set.reactions[j].rate == 1){ 
            sum++;
          }
        }
      }    
      return sum;
    }

    var dislikes_sum = function (tweet_set) {
      var sum = 0;
      if(tweet_set.reactions){
        for (var j = 0; j < tweet_set.reactions.length; j++){
          if (tweet_set.reactions[j].rate != 1){ 
            sum++;
          }
        }
      }    
      return sum;
    }

    var retweets_sum = function (tweet_set, index) {
      var tweet_id = tweet_set[index].id;
      var sum = 0;
      for (var i = 0; i < tweet_set.length; i++){
        if(tweet_set[i].retweet == tweet_id){
          sum++;
        }
      }
      return sum;
    }

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        if (!data.date_ini){
          data.date_ini = new Date("1970-01-02");
        }
        if(!data.date_end){
          data.date_end = new Date;
        }
        console.log(data.date_ini);
        Tweet.find({createdAt: {'>=': new Date(data.date_ini), '<=': new Date(data.date_end)} }).populate("reactions").exec(function(err, tweet_set){
          if(err) throw err;
          
          if(tweet_set){
            tweet_set = initialize_values(tweet_set);
            //console.log(tweet_set.length);
            for(var i = 0; i < tweet_set.length; i++){
              tweet_set[i].number_likes = likes_sum(tweet_set[i]);
              tweet_set[i].number_dislikes = dislikes_sum(tweet_set[i]);
              tweet_set[i].number_retweets = retweets_sum(tweet_set, i);
            }
            for(var i = 0; i < tweet_set.length; i++){
              tweet_set[i].impact = ((tweet_set[i].number_retweets * 5) + (tweet_set[i].number_likes*3) - tweet_set[i].number_dislikes); 
            }

            context.response = tweet_set.sort(function(a,b){
              return b.impact-a.impact;
            }).slice(0, 20);

            console.log(context.response);
            context.status = 'success';
            return res.json(context);
          }
        });
      } catch (err) {
        return res.json(context);
      }
    } else return res.json(context);
  }
};
