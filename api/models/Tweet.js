/**
 * Tweet.js
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

    title : {
      type: 'string',
    },

    text : {
      type: 'text',
    },

    outro : {
      model: 'tweet'
    },

    reaction_set: {
      collection: 'reaction',
      via: 'tweet'
    }

    // type : {
    //   isShare: function (value) {
    //     if(outro != null)
    //       return true
    //     else if (outro.title != null && outro.text != null)
    //       return true
    //     else
    //       return false
    //   }
    // }
  }
};

