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
      var tweet = Tweet.findOne({id: data.tweet}).exec(function (err, record){
        if(err) throw err;
        console.log(record);
        return record;
      } );
      var user = User.findOne({username: data.user}).exec(function (err, record){
        if(err) throw err;
        console.log(record);
        return record;
      } );
      console.log("Tweet: " + tweet + " User: " + user);
      data.tweet = tweet;
      data.user = user;
      if (user && tweet) {
        try {
          Reaction.create(data).exec(function createCB(err, created){
            if(err) throw err;
            var aux = "";
            if (created.reaction == 1)
              aux = "like";
            else if (created.reaction == -1)
              aux = "dislike";
            console.log('Created reaction ' + aux + ' in tweet with title ' + tweet.title);
          });
          context.status = 'success';
        } catch (err) {}
      }
    }
    return res.json(context);
  }
};

