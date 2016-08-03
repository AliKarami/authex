'use strict';

var config = require('./config');
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




module.exports = function () {
	function permit(who,where,forWhat) {
		var newPermit = [];
		//first should replace names with codes!
        
		// var whereStr = where.join('-');
		// var forWhatStr = forWhat.join(',');
		// var newPerm = [whereStr,forWhatStr].join(':');
		var permissions = config.userGetter(who) || [];
		permissions.push(newPerm);
		config.userSetter(who,permissions)
	}

    function forbid(who,where,forWhat) {
        var newForbid = [];
        //first should replace names with codes!
        // var whereStr = where.join('-');
        // var forWhatStr = forWhat.join(',');
        // var newPerm = [whereStr,forWhatStr].join(':');
        var permissions = config.userGetter(who) || [];
        //delete newForbid from permissions
        config.userSetter(who,permissions)
    }

	function hasPermission(who,where,forWhat) {
		//parse user permissions
		var perms = parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(perms)) {
			return false;
		} else {

		}
	}

	function wherePermissions(who,forWhat) {
		//parse user permissions
		var perms = parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	}

	function whichPermissions(who,where) {
		//parse user permissions
		var perms = parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	}
	function getPermissions(who) {
		//parse user permissions
		var perms = parseUserPermissions(who);

		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	}

};