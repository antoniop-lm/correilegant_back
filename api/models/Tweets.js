/**
 * Tweets.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user : {
  		model: 'users'
  	},

  	title : {
  		type: 'string'
  	},

  	text : {
  		type: 'text'
  	},

  	timestamp : {
  		type: 'datetime',
  		defaultsTo: new Date()
  	},

  	reactions : {
  		model: 'reactions',
  		via: 'tweet'
  	},

  	outro : {
  		model: 'tweets'
  	},

  	type : {
  		isShare: function (value) {
  			if(outro !== NULL)  
  				return TRUE
  			else if (outro.title !== NULL && outro.text !== NULL) 
  				return TRUE
  			else 
  				return FALSE
  		}
  	}
  }
};

