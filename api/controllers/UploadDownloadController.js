/**
 * UploadDownloadController
 *
 * @description :: Server-side logic for managing uploaddownloads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");
var async = require("async");

module.exports = {


  uploaddb: function (req, res) {
    /*
      title
      text
    */
    var context = {};
    context.status = "error";

    console.log({'req.file': req.file('file'), 'req.file.path': req.file('file').path});

    req.file('file').upload(function (err, uploadedFiles){
    	console.log({'upfile': uploadedFiles[0], 'upfile.path': uploadedFiles[0].fd});
      if (err) throw err;
        fs.readFile(uploadedFiles[0].fd, function (err, data){
          context.data = data; //aqui ta o arquivo lido. Boa sorte, lidinhos <3
          console.log(data);
          context.status = "success";
          return res.json(context);
        });
    });


  },

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
        groups: function(cb){ Group.find().exec(function (err, data) {cb(null, data)})},
        reactions: function(cb){ Reaction.find().exec(function (err, data) {cb(null, data)})}
      },

      function(err, results){
      if (err) throw err;
      for (var i = 0; i < results.users.length; i++){
        db.users.push(results.users[i].toJSON_user());
        db.group.push({id: results.users[i].id, list: []});
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
        var index = find_by_attr(db.group, 'id', results.group[i].owner)
        db.group[index].list.push(results.group[i].toJSON_group());
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
      return res.json(db);
    });
  }
};

