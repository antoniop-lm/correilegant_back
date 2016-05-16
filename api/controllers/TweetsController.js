/**
 * TweetsController
 *
 * @description :: Server-side logic for managing Tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function (req, res) {
    /*
      user
      title
      text
      timestamp
      reactions
      outro
    */
    var context = {};

    context.status = 'error';

    console.log(req.body);
    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        Tweets.create(data).exec(function createCB(err, created){
          if(err) throw err;
          console.log('Created tweet with title ' + created.title);
        });
        context.status = 'success';
      } catch (err) {}
    }
    return res.json(context);
  }
};

