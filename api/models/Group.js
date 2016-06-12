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
      required: true,
      notNull: true
    },

    name : {
      type: 'string',
      required: true
    },

    members : {
      collection: 'user',
      via: 'groups'
    },

    toJSON_group: function () {
      var list_members = [];
      for(var i = 0; i < this.members.length; i++){
        list_members.push(this.members[i].id);
      }
      return{
        "nome": this.name,
        "users": list_members,
        "relativeId": this.id
      }
    }
  }
};

