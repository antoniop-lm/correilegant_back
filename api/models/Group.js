/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    owner : {
      model: 'user',
      required: true
    },

    name : {
      type: 'string',
      required: true
    },

    members : {
      collection: 'user',
      via: 'groups'
    },

    owner:{
      model: 'user',
      required: true,
      notNull: true
    }
  }
};

