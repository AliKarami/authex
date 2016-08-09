'use strict';

var config = require('./config');
var core = require('./core');
var _ = require('underscore');

//  Permissions schema:
//      [
//         '11-2-12-0:100,102',
//         '10-1-11-2:101'
//      ]

//  Who schema:
//      1
//      OR
//      [
//          1,
//          2,
//          3
//      ]

//  Where schema:
//      'tehran'
//      OR
//      [
//          'tehran',
//          'shomal',
//          'all'
//      ]

//  forWhat schema:
//      'writepost'
//      OR
//      [
//          'writepost',
//          'readpost'
//      ]

    function _permitAUser(aWho,arrayOfPlaceCodes,capCodes) {
        return new Promise(function (resolve,reject) {
            var newPerms = [];
            for (var i=0,len=arrayOfPlaceCodes;i<len;i++) {
                newPerms.push(core.makePerm(arrayOfPlaceCodes[i],capCodes));
            }
            config.userGetter(aWho).then(function (userPerms) {
                for (var i=0,len=newPerms.length;i<len;i++) {
                    userPerms.push(newPerms[i])
                }
                return config.userSetter(aWho,userPerms);
            },function (reason) {
                reject(reason);
            }).then(function (updatedUser) {
                resolve(updatedUser);
            },function (reason) {
                reject(reason);
            })
                .catch(function (err) {
                    reject(err);
                });
        })
    }


    function _permit(who,where,forWhat) {
        var placeCodes = [];
        var capCodes = core.parseCap(forWhat);
        for (var i=0,len=where.length;i<len;i++){
            var placec = [];
            for (var j=0,leng=where[i].length;j<leng;j++) {
                placec.push([j,where[i][j]])
            }
            placeCodes.push(core.parsePlace(placec))
        }
        if (Array.isArray(who)) {
            //should permit multiple users
        } else {
            //should permit one user
            return _permitAUser(who,placeCodes,capCodes);
        }
    }

    function _forbid(who,where,forWhat) {
        var newForbid = [];
        //first should replace names with codes!
        // var whereStr = where.join('-');
        // var forWhatStr = forWhat.join(',');
        // var newPerm = [whereStr,forWhatStr].join(':');
        var permissions = config.userGetter(who) || [];
        //delete newForbid from permissions
        config.userSetter(who,permissions)
    }

    function _hasPermission(who,where,forWhat) {
        //parse user permissions
        var perms = core.parseUserPermissions(who);

        //if permissions is empty:
        if(_.isEmpty(perms)) {
            return false;
        } else {

        }
    }

    function _wherePermitted(who,forWhat) {
        //parse user permissions
        var perms = parseUserPermissions(who);

        //if permissions is empty:
        if(_.isEmpty(permissions)) {
            return [];
        } else {

        }
    }

    function _whichPermitted(who,where) {
        //parse user permissions
        var perms = parseUserPermissions(who);

        //if permissions is empty:
        if(_.isEmpty(permissions)) {
            return [];
        } else {

        }
    }

    function _getPermissions(who) {
        //parse user permissions
        var perms = parseUserPermissions(who);

        //if permissions is empty:
        if(_.isEmpty(permissions)) {
            return [];
        } else {

        }
    }

module.exports = {
	permit: _permit,
    forbid: _forbid,
	hasPermission: _hasPermission,
	wherePermitted: _wherePermitted,
	whichPermitted: _whichPermitted,
	getPermissions: _getPermissions
};