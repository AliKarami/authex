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
            for (var i=0,len=arrayOfPlaceCodes.length;i<len;i++) {
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
            var parsedPlacec = core.parsePlace(placec);
            var placeCode = [];
            for (var k=0,le=parsedPlacec.length;k<le;k++) {
                placeCode.push(parsedPlacec[k][1]);
            }
            placeCodes.push(placeCode);
        }
        if (Array.isArray(who)) {
            return new Promise(function (resolve,reject) {
                var promises = [];
                for (var z=0,l=who.length;z<l;z++) {
                    promises.push(_permitAUser(who[z],placeCodes,capCodes));
                }
                Promise.all(promises).then(function (results) {
                    resolve(results);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        } else {
            return _permitAUser(who,placeCodes,capCodes);
        }
    }

    function _forbidAUser(who,where,forWhat) {

    }

    function _forbid(who,where,forWhat) {
        var placeCodes = [];
        var capCodes = core.parseCap(forWhat);
        for (var i=0,len=where.length;i<len;i++){
            var placec = [];
            for (var j=0,leng=where[i].length;j<leng;j++) {
                placec.push([j,where[i][j]])
            }
            var parsedPlacec = core.parsePlace(placec);
            var placeCode = [];
            for (var k=0,le=parsedPlacec.length;k<le;k++) {
                placeCode.push(parsedPlacec[k][1]);
            }
            placeCodes.push(placeCode);
        }
        if (Array.isArray(who)) {
            return new Promise(function (resolve,reject) {
                var promises = [];
                for (var z=0,l=who.length;z<l;z++) {
                    promises.push(_forbidAUser(who[z],placeCodes,capCodes));
                }
                Promise.all(promises).then(function (results) {
                    resolve(results);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        } else {
            return _forbidAUser(who,placeCodes,capCodes);
        }
    }

    function _hasPermissionAUser(who,where,forWhat) {

    }

    function _hasPermission(who,where,forWhat) {
        var placeCodes = [];
        var capCodes = core.parseCap(forWhat);
        for (var i=0,len=where.length;i<len;i++){
            var placec = [];
            for (var j=0,leng=where[i].length;j<leng;j++) {
                placec.push([j,where[i][j]])
            }
            var parsedPlacec = core.parsePlace(placec);
            var placeCode = [];
            for (var k=0,le=parsedPlacec.length;k<le;k++) {
                placeCode.push(parsedPlacec[k][1]);
            }
            placeCodes.push(placeCode);
        }
        if (Array.isArray(who)) {
            return new Promise(function (resolve,reject) {
                var promises = [];
                for (var z=0,l=who.length;z<l;z++) {
                    promises.push(_hasPermissionAUser(who[z],placeCodes,capCodes));
                }
                Promise.all(promises).then(function (results) {
                    for (var i=0,len=results.length;i<len;i++){
                        if (results[i]==false) {
                            resolve(false);
                            return;
                        }
                    }
                    resolve(true);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        } else {
            return _hasPermissionAUser(who,placeCodes,capCodes);
        }
    }

    function _wherePermittedAUser(who,forWhat) {

    }

    function _wherePermitted(who,forWhat) {
        var capCodes = core.parseCap(forWhat);
        if (Array.isArray(who)) {
            return new Promise(function (resolve,reject) {
                var promises = [];
                for (var z=0,l=who.length;z<l;z++) {
                    promises.push(_wherePermittedAUser(who[z],capCodes));
                }
                Promise.all(promises).then(function (results) {
                    resolve(results);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        } else {
            return _wherePermittedAUser(who,capCodes);
        }
    }

    function _whichPermittedAUser(who,where) {

    }

    function _whichPermitted(who,where) {
        var placeCodes = [];
        for (var i=0,len=where.length;i<len;i++){
            var placec = [];
            for (var j=0,leng=where[i].length;j<leng;j++) {
                placec.push([j,where[i][j]])
            }
            var parsedPlacec = core.parsePlace(placec);
            var placeCode = [];
            for (var k=0,le=parsedPlacec.length;k<le;k++) {
                placeCode.push(parsedPlacec[k][1]);
            }
            placeCodes.push(placeCode);
        }
        if (Array.isArray(who)) {
            return new Promise(function (resolve,reject) {
                var promises = [];
                for (var z=0,l=who.length;z<l;z++) {
                    promises.push(_whichPermittedAUser(who[z],placeCodes));
                }
                Promise.all(promises).then(function (results) {
                    resolve(results);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        } else {
            return _whichPermittedAUser(who,placeCodes);
        }
    }

    function _getPermissionsAUser(who) {

    }

    function _getPermissions(who) {
        if (Array.isArray(who)) {
            return new Promise(function (resolve,reject) {
                var promises = [];
                for (var z=0,l=who.length;z<l;z++) {
                    promises.push(_getPermissionsAUser(who[z]));
                }
                Promise.all(promises).then(function (results) {
                    resolve(results);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        } else {
            return _getPermissionsAUser(who);
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