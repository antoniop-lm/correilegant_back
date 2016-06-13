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
      Requisitos: -
      Paramêtros: Arquivo .json contendo uma base de dados
      Saida: -

      Importa toda a base de dados de um .json, que foi definido pela turma, para o postgress
    */

    var obj = null;

    var load_users = function (cb) {
      var list = [];
      for (var i=0; i < obj.users.length; i++){
        list.push({
          "id": obj.users[i].id,
          "name": obj.users[i].nome,
          "username": obj.users[i].login,
          "description": obj.users[i].bio,
          "password": obj.users[i].password,
          "birthday": obj.users[i].birthday.split("-").reverse().join("-"),
          "createdAt": obj.users[i].timestamp,
          "updatedAt": obj.users[i].timestamp,
        });
      }
      User.create(list).exec(function(err, result){
        if (err) cb(err, null);
        cb(null, result);
      });

    }

    var vincule_user = function(item, cb){
      User.findOne(item.follower).exec(function(err, result){
        if (err) cb(err, null);
        result.follow.add(item.follows);
        result.save(function(err, result_save) {
          if(err) cb(err, null);
          cb(null, result_save);
        });

      });
    }

    var load_follows = function (cb) {
      var list = [];
      async.forEach(obj.follow, vincule_user, function(err){
        if (err) cb(err);
        cb();
      });
    }
    
    var load_groups = function (cb) {
      var list = [];
      for (var i=0; i < obj.group.length; i++){
        
        for(var j = 0; j < obj.group[i].list.length; j++){
          list.push({
            "owner": obj.group[i].id,
            "name": obj.group[i].list[j].nome,
            "members": obj.group[i].list[j].users
          });

        }
      }
      Group.create(list).exec(function(err, result){
        if (err) cb(err, null);
        cb(null, result);
      });
    }

    var load_tweets = function (cb) {
      var list1 = [];
      for (var i=0; i < obj.tweets.length; i++){
        list1.push({
          "id": obj.tweets[i].id,
          "text": obj.tweets[i].text,
          "title": obj.tweets[i].title,
          "user": obj.tweets[i].user,
          "createdAt": obj.tweets[i].timestamp,
          "updatedAt": obj.tweets[i].timestamp,
        });
      }
      var list2 = [];
      for (var i=0; i < obj.share.length; i++){
        list2.push({
          "id": obj.share[i].id,
          "retweet": obj.share[i].tweet,
          "user": obj.share[i].user,
          "createdAt": obj.share[i].timestamp,
          "updatedAt": obj.share[i].timestamp,
        });
      }
      Tweet.create(list1).exec(function(err, result){
        if (err) cb(err, null);
        Tweet.create(list2).exec(function(err, result){
          if (err) cb(err, null);
          cb(null, result);
        });
      });
    }

    var load_reactions = function (cb) {
      var list = [];
      for (var i=0; i < obj.reactions.length; i++){
        list.push({
          "rate": obj.reactions[i].reaction,
          "user": obj.reactions[i].user,
          "tweet": obj.reactions[i].tweet,
          "createdAt": obj.reactions[i].timestamp,
          "updatedAt": obj.reactions[i].timestamp,
        });
      }
      Reaction.create(list).exec(function(err, result){
        if (err) cb(err, null);
        cb(null, result);
      });
    }

    var context = {};
    context.status = "error";

    try {
      req.file('file').upload(function (err, uploadedFiles){
        if (err) throw err;
        obj = JSON.parse(fs.readFileSync(uploadedFiles[0].fd, 'utf8'));
        
        async.series({
          users: load_users, 
          follows: load_follows,
          groups: load_groups,
          tweets: load_tweets,
          reactions: load_reactions
        }, function(err){
          if (err) throw err;
          context.status = "success";
          return res.json(context);
        });

      });
    }catch(err){
      return res.json(context);
    }

  },

  downloadDB: function (req, res) {
    /*
      Requisitos: -
      Paramêtros: -
      Saida: Retorna um .json, que foi definido pela turma

      Exporta toda a base de dados em um .json, que foi definido pela turma.
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
        for(var j = 0; j < results.users[i].follow.length; j++){
          id_follow++;
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

        db.group[index].list.push(results.groups[i].toJSON_group());
      }

      for (var i = db.group.length-1; i >= 0 ; i--){
        if(db.group[i].list.length == 0){
          db.group.splice(i, 1);
        }
      }

      for (var i = 0; i < results.reactions.length; i++){
        db.reactions.push(results.reactions[i].toJSON_reaction());
      }

      res.set("Content-Type", "application/json");
      res.set("Content-Disposition", "attachment");

      return res.send(db);
    });
  }
};

