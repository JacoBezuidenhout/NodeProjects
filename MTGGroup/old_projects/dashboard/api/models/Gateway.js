/**
 * Gateway.js
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
      type: 'string'
    },

    type: {
      type: 'string',
      required: true
    },

    lat: {
      type: 'number'
    },

    lon: {
      type: 'number'
    },

    nodes: {
      collection: "node"
    }

  }
};
