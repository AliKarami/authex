'use strict';

var config = require('./config');
var _ = require('underscore');
var promiseFall = require("promisefall");

config.init();

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
    function _parseUserPermissions(who) {
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
    function _parseAPlace(level,placeName) {
        return config.getMap().place[level][placeName.toLowerCase()];
    }
    function _parsePlaces(places) {
        var parsed = [];
        for(var i=0 ,len=places.length;i<len;i++) {
            parsed.push([places[i][0],config.getMap().place[places[i][0]][places[i][1].toLowerCase()]]);
        }
        return parsed;
    }
    function _parsePlace() {
        if (Array.isArray(arguments[0])) {
            return _parsePlaces(arguments[0]);
        } else {
            return _parseAPlace(arguments[0],arguments[1]);
        }
    }
    function _parseACap(capName) {
        return config.getMap().cap[capName.toLowerCase()];
    }
    function _parseCaps(caps) {
        var parsed = [];
        for(var i=0 ,len=caps.length;i<len;i++) {
            parsed.push(config.getMap().cap[caps[i].toLowerCase()]);
        }
        return parsed;
    }
    function _parseCap() {
        if (Array.isArray(arguments[0])) {
            return _parseCaps(arguments[0]);
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

module.exports = {
    parsePermissions: _parsePermissions,
    parseUserPermissions: _parseUserPermissions,
    parsePlace: _parsePlace,
    parseCap: _parseCap,
    parsePlaceAndCreate: _ParsePlaceAndCreate,
    parseCapAndCreate: _parseCapAndCreate
};
