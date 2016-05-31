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
      required: true,
      notNull: true
    },

    title : {
      type: 'string',
    },

    text : {
      type: 'text'
    },

    reactions: {
      collection: 'reaction',
      via: 'tweet'
    },

//Se retweet for um valor "null", significa que é um tweet,
//Se for um valor "tweet" ou "NotNull", ele é um retweet, 
//Dessa forma um retweet pode encontrar o tweet que retuitou,
//mas um tweet não pode encontrar seus retweets. 
    retweet : {
      model: 'tweet'
    }

  },

  afterValidate: function (values, cb) {
    if(values.retweet != null)
      cb();
    else if (values.title != null && values.text != null)
      cb();
    else
      cb("Não é tweet nem retweet.");
  }
};

