'use strict';

var config = require('./config');

function parseUserPermissions(who) {
    var permissions = config.userGetter(who) || [];
    var wherePermissions = [];
    var forWhatPermissions = [];
    for (var i=0, len=permissions.length; i<len; i++) {
        var splitWh = permissions[i].split(':');
        var splitWhere = splitWh[0].split('-');
        var splitForWhat = splitWh[1].split(',');
        wherePermissions.push(splitWhere);
        forWhatPermissions.push(splitForWhat);
    }
    return {wherePerms: wherePermissions, forWhatPerms: forWhatPermissions};
}


module.exports.parseUserPermissions = parseUserPermissions;
