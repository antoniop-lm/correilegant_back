/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  eu: function (req, res) {
    var context = {};
    context.status = 'error';

    try{
      User.findOne(req.user.id).populate("tweet_set").exec(function(err, found){
        if(err) throw err;
        context.user = found;
        context.status = 'success';
        res.json(context);
      });
    } catch(err){
      res.json(context);
    }
  },

  details: function (req, res) {
    var context = {};
    context.status = 'error';
    try {
      User.findOne({"username" : req.param("id")}).exec(function(err, found){
        if (err) throw err;
        context.user = found;
        //console.log(found);
        context.status = 'success';
        res.json(context);
      });
    } catch(err){
      res.json(context);
    }
  },

  am_i_following: function (req, res) {
    var context = {};
    context.status = 'error';
    var data = (req.body.formdata) ? req.body.formdata : undefined;

          console.log(data);
    if(data){
      try {
        User.findOne(req.user.id).populate("follow").exec(function(err, found){
          if (err) throw err;
          data.requester = found;

          User.findOne({"username" : data.user}).exec(function(err, found){
            if (err) throw err;
            var id_list = [];
            for (var i in data.requester.follow){
              id_list.push(data.requester.follow[i].id);
            }
            console.log(id_list.indexOf(found.id));
            context.following = id_list.indexOf(found.id) != -1;
            context.status = 'success';
            res.json(context);
          });

        });

      } catch(err){
        res.json(context);
      }
    } else {
      res.json(context);
    }
  },

  new_user: function (req, res) {
    /*
      name
      username
      description
      password
      birthday
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.birthday = new Date(data.birthday);
        User.create(data).exec(function createCB(err, created){
          if(err) throw err;
          console.log('Created user with name ' + created.name);
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

  follow: function (req, res) {
    /*
      user
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);
    console.log(req.body.formdata);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    console.log("data");
    console.log(data);
    if (data) {
      try {
        User.findOne({where: {username: data.user}}).exec(function(err, result){
          if(err) throw err;
          console.log("result");
          console.log(result);
          if(result){
            data.following = result;

            requester = req.user;
            console.log("requester");
            console.log(requester);
            requester.follow.add(data.following.id);
            console.log("requester.follow");
            console.log(requester.follow);
            requester.save(function(err, result) {
              if(err) throw err;
              context.status = 'success';
              res.json(context);
            });
          } else
            res.json(context);
        });
      } catch (err) {res.json(context);}
    } else res.json(context);
  },

  unfollow: function (req, res) {
    /*
      user
    */
    var context = {};
    context.status = 'error';

    console.log(req.body);
    console.log(req.body.formdata);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    console.log("data");
    console.log(data);
    if (data) {
      try {
        User.findOne({where: {username: data.user}}).exec(function(err, result){
          if(err) throw err;
          console.log("result");
          console.log(result);
          if(result){
            data.following = result;

            requester = req.user;
            console.log("requester");
            console.log(requester);
            requester.follow.remove(data.following.id);
            console.log("requester.follow");
            console.log(requester.follow);
            requester.save(function(err, result) {
              if(err) throw err;
              context.status = 'success';
              res.json(context);
            });
          } else
            res.json(context);
        });
      } catch (err) {res.json(context);}
    } else res.json(context);
  },

  // unfollow: function (req, res) {
  //   /*
  //     following
  //   */
  //   var context = {};
  //   context.status = 'error';

  //   console.log(req.body);

  //   var data = (req.body.formdata) ? req.body.formdata : undefined;
  //   if (data) {
  //     try {
  //       User.findOne({where: {username: data.following}}).exec(function(err, result){
  //         if(err) throw err;
  //         if(result){
  //           data.following = result.id;

  //           result = req.user;
  //           result.follow.remove(data.following);
  //           result.save(function(err, res) {
  //             if(err) throw err;
  //             context.status = 'success';
  //             return res.json(context);
  //           });
  //         } else
  //           return res.json(context); 
  //       });
  //     } catch (err) {return res.json(context);}
  //   } else return res.json(context);
  // },

  search_user: function(req,res) {
    /*
      user
    */
    var context = {};
    context.status = "error";

    
      try {
        User.find({username: {contains: req.param("id")}}).exec(function(err, result){
          if(err) throw err;
          if(result){
            context.result = result;
            context.status = 'success';
            return res.json(context);
          } else
            return res.json(context);
        });
      } catch (err) {return res.json(context);}
  },

  update_user: function (req, res) {
    /*
      name
      username
      description
      password
      birthday
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    console.log("to aqui");
    console.log(data);
    if (data) {
      var newData = {};
      newData.username = data.username;
      newData.name = data.name;
      newData.birthday = data.birthday;
      newData.description = data.description;
      
      try {
        User.findOne(req.user.id).exec(function(err, result){
          console.log(result);
          if(err) throw err;
          if(result){
            User.update({id: req.user.id}, newData).exec(function (err, updated){
              if(err) throw err;
              context.status = 'success';
              return res.json(context);
            });
          } 
          else
            return res.json(context);
        });
      } catch (err) {
        return res.json(context);
      }
    }
  
  },

  update_user_password: function (req, res) {
    /*
      password
      newpassword
    */

    var context = {};
    context.status = 'error';

    console.log(req.body);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    console.log("to aqui dentro");
    console.log(data);
    if (data) {
      var newData = {};
      newData.password = data.newpassword;
      
      try {
        console.log("req user id "+ req.user.id);
        User.findOne(req.user.id).exec(function(err, result){
          console.log(result);
          if(err) throw err;
          if(result){
            if (result.password == data.password){
              User.update({id: req.user.id}, newData).exec(function (err, updated){
                if(err) throw err;
                context.status = 'success';
                return res.json(context);
              });
            } else {
              context.status = 'notpassword';
              return res.json(context);
            }
          } 
          else
            return res.json(context);
        });
      } catch (err) {
        return res.json(context);
      }
    }
  
  },

  delete_user: function (req,res){
    
    var context = {};
    context.status = 'error';

    console.log(req.user.id);

    var data = (req.body.formdata) ? req.body.formdata : undefined;
    if (data) {
      try {
        data.user = req.user.id;

        req.logout();
        User.destroy({where: {id: data.user}}).exec(function(err){
          if(err) throw err;
          context.status = 'success';
          return res.json(context);
        });
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  },

  //influence= (número total de tweets * 2) + (número total de republicações * 2) + número total de likes - número total de dislikes
  user_top20: function (req, res) {
    /*
      
    */
    var context = {};
    context.status = 'error';
    var actual_user = -1;

    var initialize_values = function (users) {
      for(var i = 0; i < users.length; i++){
        users[i].number_tweets = 0;
        users[i].number_reactions = 0;
        users[i].number_retweets = 0;
      }
      return users;
    }

    var find_user = function(array, value){
      for(var i = 0; i < array.length; i++) {
        if(array[i].id == value) {
            return i;
        }
      }
    }

    var reaction_sum = function (tweet_set) {
      var sum = 0;
      if(tweet_set.reactions){
        for (var j = 0; j < tweet_set.reactions.length; j++){
          if (tweet_set.reactions[j].rate == 1){ 
            sum++;
          } else {
            sum--;
          }
        }
      }    
      return sum;
    }

    var sum_retweets = function (tweet_set, index) {
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
        data.user = req.user.id;
        User.find().exec(function(err, users){
          if(err) throw err;
          if(users){
            //console.log(users);
            Tweet.find().populate("reactions").exec(function(err, tweet_set){
              if(err) throw err;
              if(tweet_set){
                users = initialize_values(users);
                for(var i = 0; i < tweet_set.length; i++){
                  if (!tweet_set[i].retweet){
                    var user_pos = find_user(users, tweet_set[i].user);
                    users[user_pos].number_tweets++;
                    users[user_pos].number_retweets += sum_retweets(tweet_set, i);
                    users[user_pos].number_reactions += reaction_sum(tweet_set[i]);
                  }
                }
                for(var i = 0; i < users.length; i++){
                  users[i].influence = ((users[i].number_tweets *2) + (users[i].number_retweets*2) + users[i].number_reactions); 
                }

                context.response = users.sort(function(a,b){
                  return b.influence-a.influence;
                }).slice(0, 20);

                console.log(context.response);
                context.status = 'success';
                return res.json(context);
              }
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

  user_similarity10: function (req,res){
    /*
      id
    */
    var context = {};
    context.status = 'error';

    //console.log(req.body);

    var data = req.param("id") ? req.param("id") : undefined;
    if (data) {
      try {
        //aqui vai a pesquisa, username está dentro de data
      } catch (err) {return res.json(context);}
    } else return res.json(context);
  }
};

