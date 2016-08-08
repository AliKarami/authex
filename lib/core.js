'use strict';

var config = require('./config');
var _ = require('underscore');

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
            //parser:
            {
                var wherePermitted = [];
                var whichPermitted = [];
                for (var i=0, len=data.length; i<len; i++) {
                    var splitWh = data[i].split(':');
                    var splitPlaces = splitWh[0].split('-');
                    var splitCaps = splitWh[1].split(',');
                    wherePermitted.push(splitPlaces);
                    whichPermitted.push(splitCaps);
                }
                var permissions = {places: wherePermitted, caps: whichPermitted};
            }
            resolve(permissions);
        },function (reason) {
            console.dir("reason: " + reason);
            reject(reason);
        }).catch(function (err) {
            console.dir("err: " + err);
            reject(err);
        });
    });
}
    //places default schema: [[0,'tehran'],[2,'javanan']]
    function _parsePlace(level,placeName) {
    return config.getMap().place[level][placeName.toLowerCase()];
}
    function _parseCap(capName) {
    return config.getMap().cap[capName.toLowerCase()];
}
    function _parsePlaces(places) {
    var parsed = [];
    for(var i=0 ,len=places.length;i<len;i++) {
        parsed.push([places[i][0],config.getMap().place[places[i][0]][places[i][1].toLowerCase()]]);
    }
    return parsed;
}
    function _parseCaps(caps) {
    var parsed = [];
    for(var i=0 ,len=caps.length;i<len;i++) {
        parsed.push(config.getMap().cap[caps[i].toLowerCase()]);
    }
    return parsed;
}
    function _ParsePlaceAndCreate(level,placeName) {
    return new Promise (function (resolve,reject) {
        var placeCode = config.getMap().place[level][placeName.toLowerCase()];
        if (placeCode==undefined) {
            config.addPlace(level,placeName).then(function (pc) {
                resolve(pc);
            },function (reason) {
                reject(reason);
            })
                .catch(function (err) {
                    reject(err);
                })
        } else {
            resolve(placeCode);
        }
    })
}
    function _parseCapAndCreate(capName) {
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

module.exports = {
    parsePermissions: _parsePermissions,
    parseUserPermissions: _parseUserPermissions,
    parsePlace: _parsePlace,
    parseCap: _parseCap,
    parsePlaces: _parsePlaces,
    parseCaps: _parseCaps,
    parsePlaceAndCreate: _ParsePlaceAndCreate,
    parseCapAndCreate: _parseCapAndCreate
};
