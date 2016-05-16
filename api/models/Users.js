/**
 * Users.js
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
  		required: true,
  	},
  	
  	password : {
  		type: 'string',
  		required: true,
  	},

  	birthday : {
  		type: 'date',
  		required: true,
  	},

  	id_follow : {
  		collection: 'follow',
  		via: 'user'
  	},

  	followers : {
  		collection: 'follow',
  		via: 'follows',
  		dominant: true
  	},

  	id_group : {
  		collection : 'group',
  		via: 'owner'
  	},

  	groups : {
  		collection: 'group',
  		via: 'users',
  		dominant: true
  	},

  	tweets : {
  		collection : 'tweets',
  		via: 'user'
  	},

  	reactions : {
  		collection : 'reactions',
  		via: 'user'
  	}
  }
};

