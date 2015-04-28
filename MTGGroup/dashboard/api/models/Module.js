/**
 * Module.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    serial: {
      type: 'string',
      required: true
    },

    description: {
      type: 'string',
      defaultsTo: ""
    },

    datapoints: {
      collection: "datapoint"
    }
  }
};
