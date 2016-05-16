/**
 * Reactions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user : {
  		model: 'users',
  		unique: true
  	},

  	tweet : {
  		models: 'tweets',
  		unique: true
  	},

  	value : {
  		type: 'int',
  		required: true
  	}
  }
};

