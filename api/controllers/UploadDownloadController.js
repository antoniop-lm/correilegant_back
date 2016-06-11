/**
 * UploadDownloadController
 *
 * @description :: Server-side logic for managing uploaddownloads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");
var async = require("async");

module.exports = {


  // uploaddb: function (req, res) {
  //   /*
  //     title
  //     text
  //   */
  //   var obj = null;

  //   var load_users = function (cb) {
  //     var list = [];
  //     for (var i=0; i < obj.users.length; i++){
  //       list.push({
  //         "id": obj.users[i].id;
  //         "name": obj.users[i].nome,
  //         "username": obj.users[i].login,
  //         "description": obj.users[i].bio,
  //         "password": obj.users[i].password,
  //         "birthday": obj.users[i].birthday.split("-").reverse().join("-"),
  //         "createdAt": obj.users[i].timestamp,
  //         "updatedAt": obj.users[i].timestamp,
  //       });
  //     }
  //     User.create(list).exec(function(err, result){
  //       if (err) cb(err, null);
  //       cb(null, result);
  //     });

  //   }

  //   var vincule_user = function(item, cb){
  //     User.findOne(item.follower).exec(function(err, result){
  //       if (err) cb(err, null);
  //       result.follow.add(item.follows);
  //       result.save(function(err, result_save) {
  //         if(err) cb(err, null);
  //         cb(null, result_save);
  //       });

  //     });
  //   }

  //   var load_follows = function (cb) {
  //     var list = [];
  //     async.each(obj.follow, vincule_user, function(err){
  //       if (err) cb(err);
  //       cb();
  //     });
  //   }
    
  //   //ROLÊ
  //   var load_groups = function (cb) {
  //     var list = [];
  //     for (var i=0; i < obj.users.length; i++){
  //       list.push({
  //         "id": obj.users[i].id;
  //         "name": obj.users[i].nome,
  //         "username": obj.users[i].login,
  //         "description": obj.users[i].bio,
  //         "password": obj.users[i].password,
  //         "birthday": obj.users[i].birthday.split("-").reverse().join("-"),
  //         "createdAt": obj.users[i].timestamp,
  //         "updatedAt": obj.users[i].timestamp,
  //       });
  //     }
  //     User.create(list).exec(function(err, result){
  //       if (err) cb(err, null);
  //       cb(null, result);
  //     });
  //   }

  //   var load_tweets = function (cb) {
  //     var list = [];
  //     for (var i=0; i < obj.tweets.length; i++){
  //       list.push({
  //         "id": obj.tweets[i].id;
  //         "text": obj.tweets[i].text,
  //         "title": obj.tweets[i].title,
  //         "user": obj.tweets[i].user,
  //         "createdAt": obj.tweets[i].timestamp,
  //         "updatedAt": obj.tweets[i].timestamp,
  //       });
  //     }
  //     for (var i=0; i < obj.share.length; i++){
  //       list.push({
  //         "id": obj.share[i].id;
  //         "retweet": obj.share[i].tweet,
  //         "user": obj.share[i].user,
  //         "createdAt": obj.tweets[i].timestamp,
  //         "updatedAt": obj.tweets[i].timestamp,
  //       });
  //     }
  //     Tweet.create(list).exec(function(err, result){
  //       if (err) cb(err, null);
  //       cb(null, result);
  //     });
  //   }

  //   var load_reactions = function (cb) {
  //     var list = [];
  //     for (var i=0; i < obj.reactions.length; i++){
  //       list.push({
  //         "rate": obj.reactions[i].reaction;
  //         "user": obj.reactions[i].user,
  //         "tweet": obj.reactions[i].tweet,
  //         "createdAt": obj.reactions[i].timestamp,
  //         "updatedAt": obj.reactions[i].timestamp,
  //       });
  //     }
  //     Reaction.create(list).exec(function(err, result){
  //       if (err) cb(err, null);
  //       cb(null, result);
  //     });
  //   }

  //   var context = {};
  //   context.status = "error";

  //   console.log({'req.file': req.file('file'), 'req.file.path': req.file('file').path});

  //   req.file('file').upload(function (err, uploadedFiles){
  //   	console.log({'upfile': uploadedFiles[0], 'upfile.path': uploadedFiles[0].fd});
  //     if (err) throw err;
  //     obj = JSON.parse(fs.readFileSync(uploadedFiles[0].fd, 'utf8'));
      
  //     async.series({
  //       users: load_users(cb), 
  //       follows: load_follows(cb),
  //       groups: load_groups(cb),
  //       tweets: load_tweets(cb),
  //       reactions: load_reactions(cb)
  //     });

  //     context.status = "success";
  //     return res.json(context);
  //   });


  // },

  downloadDB: function (req, res) {
    /*

    */

    var id_follow = 0;

    var db = {
      "users":[],
      "follow":[],
      "group":[],
      "tweets":[],
      "reactions":[],
      "share":[]
    };

    var find_by_attr = function (list, attr, value) {
      for (var i = 0 ; i < list.length; i++){
        if(list[i][attr] == value)
          return i;
      }
      return null;
    }

    var context = {};
    context.status = "error";

    async.auto(
      {
        users: function(cb){ User.find().populate("follow").exec(function (err, data) {cb(null, data)})},
        tweets: function(cb){ Tweet.find().exec(function (err, data) {cb(null, data)})},
        groups: function(cb){ Group.find().populate("members").exec(function (err, data) {cb(null, data)})},
        reactions: function(cb){ Reaction.find().exec(function (err, data) {cb(null, data)})}
      },

      function(err, results){
      if (err) throw err;
      for (var i = 0; i < results.users.length; i++){
        db.users.push(results.users[i].toJSON_user());
        db.group.push({"id": results.users[i].id, "list": []});
        //console.log(results.users[i].follow);
        for(var j = 0; j < results.users[i].follow.length; j++){
          id_follow++;
          //console.log(results.users[i].follow);
          db.follow.push({
            "id": id_follow,
            "follower": results.users[i].id,
            "follows": results.users[i].follow[j].id,
            "timestamp": results.users[i].updatedAt
          });
        }
      }
      for (var i = 0; i < results.tweets.length; i++){
        if(!results.tweets[i].retweet)
          db.tweets.push(results.tweets[i].toJSON_tweet());
        else
          db.share.push(results.tweets[i].toJSON_retweet());
      }
      for (var i = 0; i < results.groups.length; i++){
        var index = find_by_attr(db.group, 'id', results.groups[i].owner)
        console.log({"owner": results.groups[i].owner, "index": index});

        db.group[index].list.push(results.groups[i].toJSON_group());
      }

      for (var i = db.group.length-1; i >= 0 ; i--){
        console.log(db.group[i]);
        if(db.group[i].list.length == 0){
          db.group.splice(i, 1);
        }
      }

      for (var i = 0; i < results.reactions.length; i++){
        db.reactions.push(results.reactions[i].toJSON_reaction());
      }

      console.log("batata");
      res.set("Content-Type", "application/json");
      res.set("Content-Disposition", "attachment");

      return res.send(db);
    });
  }
};

