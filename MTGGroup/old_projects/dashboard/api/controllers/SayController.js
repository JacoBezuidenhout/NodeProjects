/**
 * SayController
 *
 * @description :: Server-side logic for managing says
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  hi: function (req, res) {

    return res.send(req.body);

  },
  bye: function (req, res) {
    return res.redirect("http://www.sayonara.com");
  }
};
