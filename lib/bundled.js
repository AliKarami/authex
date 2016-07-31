'use strict';

var commons = require('./commons');
commons();

module.exports.config = require('./config');

module.exports.setPermission = function (Who,Where,forWhat) {};
module.exports.hasPermission = function (Who,Where,forWhat) {};
module.exports.wherePermissions = function (Who,forWhat) {};
module.exports.whichPermissions = function (Who,Where) {};
module.exports.getPermissions = function (Who) {};