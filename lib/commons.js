'use strict';

var config = require('./config');
var core = require('./core');
var _ = require('underscore');

//  Permission(who) schema:
//      [
//         '11-2-12-0:100,102',
//         '10-1-11-2:101'
//      ]

//  Where schema:
//      [
//          'tehran',
//          'shomal',
//          'all'
//      ]

//  forWhat schema:
//      [
//          'writepost',
//          'readpost'
//      ]




module.exports = {

	permit: function _permit(who,where,forWhat) {
		var whereCode = core.parsePlace()
		var newPermit = [];
		//first should replace names with codes!
        
		// var whereStr = where.join('-');
		// var forWhatStr = forWhat.join(',');
		// var newPerm = [whereStr,forWhatStr].join(':');
		var permissions = config.userGetter(who) || [];
		permissions.push(newPerm);
		config.userSetter(who,permissions)
	},

    forbid: function _forbid(who,where,forWhat) {
        var newForbid = [];
        //first should replace names with codes!
        // var whereStr = where.join('-');
        // var forWhatStr = forWhat.join(',');
        // var newPerm = [whereStr,forWhatStr].join(':');
        var permissions = config.userGetter(who) || [];
        //delete newForbid from permissions
        config.userSetter(who,permissions)
    },

	hasPermission: function _hasPermission(who,where,forWhat) {
		//parse user permissions
		var perms = core.parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(perms)) {
			return false;
		} else {

		}
	},

	wherePermitted: function _wherePermitted(who,forWhat) {
		//parse user permissions
		var perms = parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	},

	whichPermitted: function _whichPermitted(who,where) {
		//parse user permissions
		var perms = parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	},

	getPermissions: function _getPermissions(who) {
		//parse user permissions
		var perms = parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	}

};