/**
 * ReactionController
 *
 * @description :: Server-side logic for managing Reaction
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function (req, res) {
    /*
      tweet
      value
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;
        //data.valor = parseInt(data.valor);

        Reaction.create(data).exec(function(err, created){
          if(err) throw err;
          context.status = 'success';
          return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }
};
