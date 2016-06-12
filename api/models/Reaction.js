/**
 * Reaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user : {
      model: 'user',
      required: true
    },

    tweet : {
      model: 'tweet',
      required: true
    },

    rate : {
      type: 'integer',
      required: true
    },

    toJSON_reaction: function () {
      return{
        "tweet": this.tweet,
        "user": this.user,
        "reaction": this.rate,
        "timestamp": this.updatedAt
      }
    }
  }
};

