var _ = require('underscore');
var jsonfile = require('jsonfile');
jsonfile.spaces = 4;
var file = __dirname + '/map.json';
var map = require('./map.json');
function readFromMap() {
    return new Promise(function (resolve,reject) {
        jsonfile.readFile(file,function (err,obj) {
            if (err) {reject(err)}
            else {resolve(obj)}
        });
    })
}
function writeToMap(obj) {
    return new Promise(function (resolve,reject) {
        jsonfile.writeFile(file,obj,function (err) {
            if (err) {reject(err)}
            else {
                map = obj;
                resolve(obj);
            }
        });
    })
    
}
function getLength(number) {return number.toString().length;}

//database connection variables
{
    var mongoose = require('mongoose');
    var dbUri='mongodb://localhost:27017/authex';
    var dbConnection = mongoose.createConnection(dbUri);
    var Schema = mongoose.Schema;
    var userSchema = new Schema({uid:Number,perms:[String]});
    var User = dbConnection.model('User', userSchema, 'users');
}

    function _init() {
        return readFromMap();
    }
    function _userGetter(who) {
        return new Promise(function (resolve, reject) {
            User.findOne({uid:who}).exec(function (err,res) {
                if (err) {reject(err);}
                resolve(res.perms);
            });
        });
    }
    function _userSetter(who,newPerms) {
        return new Promise(function (resolve, reject) {
            User.update({uid:who},{uid:who,perms:newPerms},{upsert: true}).exec(function (err, updated) {
                if (err) {reject(err);}
                else {resolve(updated);}
            })
        })
}
    function _setUserGetter(func) {
        this.userGetter = func;
    }
    function _setUserSetter(func) {
        this.userSetter = func;
    }
    function _maxPlaceLevel() {return map.place.length}
    function _addPlaceLevel() {
        return new Promise(function (resolve,reject) {
            readFromMap().then(function (result) {
                result.place.push({});
                writeToMap(result).then(function (resu) {
                    resolve(resu.place.length);
                },function (reaso) {
                    reject(reaso);
                })
                    .catch(function (err) {
                        console.log("write to map: " + err);
                        reject(err);
                    });
            },function (reason) {
                console.log("read from map rejected: " + reason);
                reject(reason);
            })
                .catch(function (error) {
                    console.log("read from map: " + error);
                    reject(error);
                })
        });
    }
    function _setMaxPlaceLevelTo(toLevel) {
        return new Promise(function (resolve,reject) {
            readFromMap().then(function (result) {
                var difference = toLevel-result.place.length;
                if (difference>0) {
                    //add levels to be valid
                    for (var i = 0; i <= difference; i++) {
                        result.place.push({});
                    }
                    writeToMap(result).then(function (resu) {
                        resolve(resu.place.length-1);
                    }, function (reaso) {
                        reject(reaso);
                    })
                        .catch(function (err) {
                            reject(err);
                        });
                } else {
                    resolve(toLevel);
                }
            },function (reason) {
                reject(reason);
            })
                .catch(function (error) {
                    console.log("read from map: " + error);
                    reject(error);
                })
        });
    }
    function _addPlace(level, name) {
        name = name.toLowerCase();
        var resCode;
        return new Promise(function (resolve,reject) {
            readFromMap().then(function (obj) {
                var codes = _.values(obj.place[level]);
                //validations
    
                //is level valid?
                if (obj.place.length<level) {
                    console.log("Error: cannot addPlace, level " + level + " doesn't exists.");
                    resCode = -1;
                    reject(resCode);
                }
    
                //is name unique?
                if(_.findKey(obj.place[level],function (val,key) {return key == name})!=undefined) {
                    console.log("Error: cannot addPlace, name " + name + " already exists.");
                    resCode = -1;
                    reject(resCode);
                }
    
                //is name valid?
                if(name == 'all') {
                    console.log("Error: 'all' name is reserved.");
                    resCode = -1;
                    reject(resCode);
                }
    
                if (!_.isEmpty(codes)) {
                    var maxValue = _.max(codes);
                    var digits = getLength(maxValue);
                    var maxValid = Math.pow(10,digits)-1;
                    //is valid
                    if (maxValue<maxValid) {
                        obj.place[level][name]=maxValue + 1;
                        resCode = maxValue+1;
                        writeToMap(obj).then(function () {
                            resolve(resCode);
                        })
                            .catch(function (err) {
                                console.log("write to map: " + err)
                            });
    
                    }
                    else {
                        //is not valid
                        console.log("Error: cannot addPlace, level " + level + " is full!.");
                        resCode = -1;
                        reject(resCode);
                    }
                } else {
                    //how many digits do you want?
                    //create one! 1, 10, 100, 1000, ...
    
                    //for now for example 1 digit.
                    obj.place[level][name]=1;
                    writeToMap(obj).then(function () {
                        resCode = 1;
                        resolve(resCode);
                    })
                        .catch(function (err) {
                            console.log("write to map: " + err);
                        });
    
                }
            },function (reason) {
                console.log("read from map rejected: " + reason);
                reject(reason);
            })
                .catch(function (err) {
                    console.log("read from map: " + err);
                    reject(err);
                });
        });
    }
    function _addPlaceAndCreate(level,name) {
        return new Promise(function (resolve,reject) {
            _setMaxPlaceLevelTo(level).then(function (lev) {
                return _addPlace(lev,name);
            },function (reason) {
                reject(reason);
            }).then(function (pc) {
                resolve(pc);
            },function (reason) {
                reject(reason);
            })
                .catch(function (err) {
                    reject(err);
                })
        });
    }
    function _addCap(name) {
        name = name.toLowerCase();
        var resCode;
        return new Promise(function (resolve,reject) {
            readFromMap().then(function (obj) {
                var codes = _.values(obj.cap);
                //validations
    
                //is name unique?
                if(_.findKey(obj.cap,function (val,key) {return key == name})!=undefined) {
                    console.log("Error: cannot addCap, name " + name + " already exists.");
                    resCode = -1;
                    reject(resCode);
                }
    
                //is name valid?
                if(name == 'all') {
                    console.log("Error: 'all' name is reserved.");
                    resCode = -1;
                    reject(resCode);
                }
    
                if (!_.isEmpty(codes)) {
                    var maxValue = _.max(codes);
                    var digits = getLength(maxValue);
                    var maxValid = Math.pow(10,digits)-1;
                    //is valid
                    if (maxValue<maxValid) {
                        obj.cap[name]=maxValue + 1;
                        writeToMap(obj).then(function (res) {
                            resCode = maxValue+1;
                            resolve(resCode);
                        })
                            .catch(function (err) {
                                console.log("write to map: " + err)
                            });
                    } else {
                        //is not valid
                        console.log("Error: cannot addCap, Caps is full!.");
                        resCode = -1;
                        reject(resCode);
                    }
                } else {
                    //how many digits do you want?
                    //create one! 1, 10, 100, 1000, ...
    
                    //for now for example 3 digit.
                    obj.cap[name] = 100;
                    writeToMap(obj).then(function (res) {
                        resCode = 100;
                        resolve(resCode);
                    })
                        .catch(function (err) {
                            console.log("write to map: " + err)
                        });
                }
            },function (reason) {
                console.log("read from map rejected: " + reason);
                reject(reason);
            })
                .catch(function (err) {
                    console.log("read from map: " + err);
                    reject(err);
                });
    
        });
    }
    function _getMap() {
        return map;
    }
    function _getMapPromise() {
        return Promise.resolve(map);
    }
    function _setMap(mapObj) {
        return new Promise(function (resolve,reject) {
            writeToMap(mapObj).then(function (res) {
                resolve(res);
            })
                .catch(function (err) {
                    console.log("write to map: " + err)
                });
        });
    
    }
    function _backToSample() {
        jsonfile.writeFileSync(__dirname + '/map.json',jsonfile.readFileSync(__dirname + '/~map.json'));
        return readFromMap();
    }

module.exports  = {
    init: _init,
	userGetter: _userGetter,
	userSetter: _userSetter,
    setUserGetter: _setUserGetter,
    setUserSetter: _setUserSetter,
	maxPlaceLevel: _maxPlaceLevel,
	addPlaceLevel: _addPlaceLevel,
    setMaxPlaceLevelTo: _setMaxPlaceLevelTo,
	addPlace: _addPlace,
    addPlaceAndCreate: _addPlaceAndCreate,
	addCap: _addCap,
	getMap: _getMap,
    getMapPromise: _getMapPromise,
	setMap: _setMap,
    backToSample: _backToSample
};

//for testing purposes
module.exports.usrModel = User;