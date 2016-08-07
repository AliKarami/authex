'use strict';

var config = require('./config');
var _ = require('underscore');

config.init();

module.exports = {
    parsePermissions: function _parsePermissions(permissions) {
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
    },

    parseUserPermissions: function _parseUserPermissions(who) {
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
    },
    
    parsePlace: function _parsePlace(placeName) {

    },
    
    parseCap: function _parseCap(capName) {
        
    }
    
};
