'use strict';

var config = require('./config');
var _ = require('underscore');

//  Permission schema:
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
	function setPermission(who,where,forWhat) {
		var permissions = config.userJsonGetter(who) || [];
		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			permissions
		} else {

		}
	}
	function hasPermission(who,where,forWhat) {
		var permissions = config.userJsonGetter(who) || [];
		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return false;
		} else {

		}
	}
	function wherePermissions(who,forWhat) {
		var permissions = config.userJsonGetter(who) || [];
		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	}
	function whichPermissions(who,where) {
		var permissions = config.userJsonGetter(who) || [];
		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	}
	function getPermissions(who) {
		var permissions = config.userJsonGetter(who) || [];
		//if permissions is empty:
		if(_.isEmpty(permissions)) {
			return [];
		} else {

		}
	}
};