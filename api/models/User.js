

/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name : {
      type: 'string',
      required: true
    },

    username : {
      type: 'string',
      required: true,
      unique: true
    },

    description : {
      type: 'string',
      required: true
    },

    password : {
      type: 'string',
      required: true
    },

    birthday : {
      type: 'date',
      required: true
    },

    groups_owner:{
      collection: 'group',
      via: 'owner'
    },

    groups: {
      collection: 'group',
      via: 'members'
    },

    follow : {
      collection: 'user',
      via: 'follow_by'
    },

    follow_by:{
      collection: 'user',
      via: 'follow'
    },

    reaction_set: {
      collection: 'reaction',
      via: 'user'
    },

    tweet_set: {
      collection: 'tweet',
      via: 'user'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },

    toJSON_user: function(){
      var day = this.birthday.getDate();
      var month = this.birthday.getMonth();
      var year = this.birthday.getFullYear();

      day = (day < 10 ) ? "0"+day : day;
      month = (month < 10 ) ? "0"+month : month;

      return{
        "id": this.id,
        "nome": this.name,
        "login": this.username,
        "password": this.password,
        "birthday": day+"-"+month+"-"+year, //arrumar
        "bio": this.description,
        "timestamp": this.updatedAt
      }
    } 
  },

  // beforeCreate: function(user, cb) {
  //   bcrypt.genSalt(10, function(err, salt) {
  //     bcrypt.hash(user.password, salt, function(err, hash) {
  //       if (err) cb(err);
  //       else {
  //         user.password = hash;
  //         cb();
  //       }
  //     });
  //   });
  // }

};

