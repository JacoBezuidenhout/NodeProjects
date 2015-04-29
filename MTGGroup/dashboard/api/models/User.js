/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    email: {
      type: 'string',
      required: true,
      primaryKey: true,
      unique: true
    },

    name: {
      type: 'string',
      required: true
    },

    surname: {
      type: 'string',
      required: true
    },

    password: {
      type: 'string',
      required: true
    },

    gateways: {
      collection: "gateway"
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }
};
