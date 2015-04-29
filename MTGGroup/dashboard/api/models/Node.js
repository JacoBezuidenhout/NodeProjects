/**
 * Node.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    serial: {
      type: 'string',
      primaryKey: true,
      unique: true
    },

    description: {
      type: 'string',
      defaultsTo: ""
    },

    type: {
      type: 'string',
      required: true
    },

    status: {
      type: 'string',
      required: true
    },

    lat: {
      type: 'string',
      defaultsTo: 0
    },

    lon: {
      type: 'string',
      defaultsTo: 0
    },

    modules: {
      collection: "module"
    }

  }
};
