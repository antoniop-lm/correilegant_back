/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
	set_group: function (req, res) {
	    /*
	      name
	      *id
		  id_users
	    */
	    var context = {};
	    context.status = 'error';

	    console.log(req.body);

	    var data = (req.body) ? req.body : undefined;
	    if (data) {
	      	try {
	      		data.owner = req.user.id;
	      		var group = null;
	      		if(data.id){ 
	      			Group.update({"id": data.id, "owner": req.user.id}, data).exec(function(err, updated){
	      				if (err || !updated) throw err;
	      				// updated.members.add(data.id_users);
	  					// updated.save(function(err) {
	  						if(err) throw err;
	  						context.status = 'success';
	  						return res.json(context);
	  					// });
	      			});
	      		} else {
	      			Group.create(data).exec(function(err, created){
	      				if(err) throw err;
	      				created.members.add(data.id_users);
	  					created.save(function(err) {
	  						if(err) throw err;
	  						context.status = 'success';
	  						return res.json(context);
	  					});
	      			});
	      		}
      			

	      	} catch (err) {return res.json(context);}
	    } else return res.json(context);
  	},

  	my_groups: function(req, res) {
  		var context = {};
	    context.status = 'error';
	    try {
	    	User.findOne(req.user.id).populate("groups").exec(function(err, result){
	    		if (err) throw err;
	    		context.memberOf = result.groups;
	    		Group.find({"owner":req.user.id}).populate("members").exec(function(err, result){
	    			if (err) throw err;
	    			context.result = result;
	    			context.status = "success";
	    			return res.json(context);
	    		});
	    	});
	    	
	    } catch (err) {return res.json(context);}
  	},

  	include_member: function (req, res) {
  		/*
      	  group
      	  user
      	*/
	    var context = {};
	    context.status = 'error';

	    console.log(req.body);

	    var data = (req.body.formdata) ? req.body.formdata : undefined;
	    if (data) {
	      	try {
	      		User.findOne({where: {username: data.user}}).exec(function(err, result){
	      			if(err) throw err;
	      			if(result){
		      			data.user = result.id;
		      			data.owner = req.user.id;

	      				Group.findOne({where: {owner: data.owner, name: data.group}}).exec(function(err, result){
	      					if(err) throw err;
	      					result.members.add(data.user);
	      					result.save(function(err) {
	      						if(err) throw err;
	      						context.status = 'success';
	      						return res.json(context);
	      					});
		      			});	
		      		} else
		      			return res.json(context);
	      		});
	    } catch (err) {return res.json(context);}
      } else return res.json(context);
  	},

  	remove_member: function (req, res) {
	  	/*
	      group
	      user
	    */
	    var context = {};
	    context.status = 'error';

	    console.log(req.body);

	    var data = (req.body.formdata) ? req.body.formdata : undefined;
	    if (data) {
	      	try {
	      		User.findOne({where: {username: data.user}}).exec(function(err, result){
	      			if(err) throw err;
	      			if(result){
		      			data.user = result.id;

		      			data.owner = req.user.id;

	      				Group.findOne({where: {owner: data.owner, name: data.group}}).exec(function(err, result){
	      					if(err) throw err;
	      					result.members.remove(data.user);
	      					result.save(function(err) {
	      						if(err) throw err;
	      						context.status = 'success';
	      						return res.json(context);
	      					});
	      				});
	      			} else
	      				return res.json(context);
	      		});
	      	} catch (err) {return res.json(context);}
	    } else return res.json(context);
  	},

  	delete_group: function(req,res) {
  		/*
	      name
	    */
	    var context = {};
	    context.status = 'error';

	    console.log(req.body);

	    var data = (req.body) ? req.body : undefined;
	    if (data) {
	      	try {
      			data.owner = req.user.id;

  				Group.destroy({where: {owner: data.owner, name: data.name}}).exec(function(err){
  					if(err) throw err;
					context.status = 'success';
					return res.json(context);
  				});
	      	} catch (err) {return res.json(context);}
	    } else return res.json(context);
  	}
};

