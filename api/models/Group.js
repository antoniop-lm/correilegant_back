/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	owner : {
  		model: 'users',
  		unique: true
  	},

  	name : {
  		type: 'string',
  		required: true
  	},

  	users : {
  		collection: 'users',
  		via: 'groups'
  	}
  }
};

