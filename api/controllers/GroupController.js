/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function (req, res) {
    /*
      owner
      name
      users
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        User.findOne({where: {username: data.owner}}).exec(function(err, result){
          if(err) throw err;
          data.owner = result.id;

          Group.create(data).exec(function(err, created){
            if(err) throw err;
            context.status = 'success';
            return res.json(context);
          });
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }	
};

