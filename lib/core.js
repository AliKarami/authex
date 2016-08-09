'use strict';

var config = require('./config');
var _ = require('underscore');
var promiseFall = require("promisefall");

config.fin();

    function _parsePermissions(permissions) {
        var wherePermitted = [];
        var whichPermitted = [];
        for (var i=0, len=permissions.length; i<len; i++) {
            var splitWh = permissions[i].split(':');
            var splitPlaces = splitWh[0].split('-');
            var splitCaps = splitWh[1].split(',');
            wherePermitted.push(splitPlaces);
            whichPermitted.push(splitCaps);
        }
        return {places: wherePermitted, caps: whichPermitted};
    }
    function _parseAUserPermissions(who) {
        return new Promise(function (resolve,reject) {
            config.userGetter(who).then(function (data) {
                return _parsePermissions(data);
                })
                .then(function (perms) {
                    resolve(perms);
                },function (reason) {
                    console.dir("reason: " + reason);
                    reject(reason);
                }).catch(function (err) {
                    console.dir("err: " + err);
                    reject(err);
                });
        });
    }
    function _parseUserPermissions(who) {
        if (Array.isArray(arguments[0])) {
            var arr = Array.from(arguments)[0];
            var contexts = [];
            for (var i=0, len = arr.length; i<len; i++) {
                contexts.push([arr[i]]);
            }
            return promiseFall(_parseAUserPermissions,contexts);
        } else {
            return _parseAUserPermissions(arguments[0]);
        }
    }
    function _parseAPlace(level,placeName) {
        return [level,config.getMap().place[level][placeName.toLowerCase()]];
    }
    function _parsePlace() {
        if (Array.isArray(arguments[0])) {
            var parsed = [];
            for(var i=0 ,len=arguments[0].length;i<len;i++) {
                parsed.push(_parseAPlace(arguments[0][i][0],arguments[0][i][1]));
            }
            return parsed;
        } else {
            return _parseAPlace(arguments[0],arguments[1]);
        }
    }
    function _parseACap(capName) {
        return config.getMap().cap[capName.toLowerCase()];
    }
    function _parseCap() {
        if (Array.isArray(arguments[0])) {
            var parsed = [];
            for(var i=0 ,len=arguments[0].length;i<len;i++) {
                parsed.push(_parseACap(arguments[0][i]));
            }
            return parsed;
        } else {
            return _parseACap(arguments[0]);
        }
    }
    function _ParseAPlaceAndCreate(level,placeName) {
        return new Promise (function (resolve,reject) {
            var place = config.getMap().place[level];
            if (place==undefined) {
                config.addPlaceAndCreate(level,placeName).then(function (pc) {
                    resolve(pc);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                if (place[placeName.toLowerCase()] == undefined) {
                    config.addPlace(level,placeName).then(function (pc) {
                        resolve(pc);
                    },function (reason) {
                        reject(reason);
                    });
                } else {
                    resolve(place[placeName.toLowerCase()]);
                }
            }
        })
    }
    function _parseACapAndCreate(capName) {
        return new Promise(function (resolve,reject) {
            var capCode = config.getMap().cap[capName.toLowerCase()];
            if (capCode==undefined) {
                config.addCap(capName).then(function (cC) {
                    resolve(cC);
                },function (reason) {
                    reject(reason);
                })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                resolve(capCode);
            }
        });
    }
    function _ParsePlaceAndCreate() {
        if (Array.isArray(arguments[0])) {
            var arr = Array.from(arguments)[0];
            var contexts = [];
            for (var i=0, len = arr.length; i<len; i++) {
                contexts.push([arr[i][0],arr[i][1]]);
            }
            return promiseFall(_ParseAPlaceAndCreate,contexts);
        } else {
            return _ParseAPlaceAndCreate(arguments[0],arguments[1]);
        }
    }
    function _parseCapAndCreate() {
        if (Array.isArray(arguments[0])) {
            var arr = Array.from(arguments)[0];
            var contexts = [];
            for (var i=0, len = arr.length; i<len; i++) {
                contexts.push([arr[i]]);
            }
            return promiseFall(_parseACapAndCreate,contexts);
        } else {
            return _parseACapAndCreate(arguments[0]);
        }
    }
    function _unparsePermissions(permObj) {
        //permObj default schema: {places:[[12,17,9,2],[14,13,17,3]],caps:[[101,103],[102]]}
        var placesArray = permObj.places;
        var capsArray = permObj.caps;
        var unparsed = [];
        for (var i=0,len = placesArray.length;i<len;i++) {
            var placesStr = placesArray[i].join('-');
            var capsStr = capsArray[i].join();
            var permStr = "".concat(placesStr,':',capsStr);
            unparsed.push(permStr);
        }
        return unparsed;
    }
    function _unparseAPlace(level,placeCode) {
        return config.getMap().iplace[level][placeCode];
    }
    function _unparsePlace() {
        if (Array.isArray(arguments[0])) {
            var unparsed = [];
            for (var i=0,len=arguments[0].length;i<len;i++) {
                unparsed.push(_unparseAPlace(arguments[0][i][0],arguments[0][i][1]))
            }
            return unparsed;
        } else {
            return _unparseAPlace(arguments[0],arguments[1])
        }
    }
    function _unparseACap(capCode) {
        return config.getMap().icap[capCode];
    }
    function _unparseCap() {
        if (Array.isArray(arguments[0])) {
            var unparsed = [];
            for (var i=0,len=arguments[0].length;i<len;i++) {
                unparsed.push(_unparseACap(arguments[0][i]))
            }
            return unparsed;
        } else {
            return _unparseACap(arguments[0])
        }
    }
    function _makePerm(placeCodes,capCodes) {
        return "".concat(placeCodes.join('-'),':',capCodes.join());
    }

module.exports = {
    parsePermissions: _parsePermissions,
    parseUserPermissions: _parseUserPermissions,
    parsePlace: _parsePlace,
    parseCap: _parseCap,
    parsePlaceAndCreate: _ParsePlaceAndCreate,
    parseCapAndCreate: _parseCapAndCreate,
    unparsePermissions: _unparsePermissions,
    unparsePlace: _unparsePlace,
    unparseCap: _unparseCap,
    makePerm: _makePerm
};