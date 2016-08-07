var _ = require('underscore');
var jsonfile = require('jsonfile');
jsonfile.spaces = 4;
var file = __dirname + '/map.json';
function readFromMap() {
    //        async return value:
    // return new Promise(function (resolve,reject) {
    //     jsonfile.readFile(file, function (err, data) {
    //         if (err) {reject(err);}
    //         else {
    //             this.map = data;
    //             resolve(data);
    //         }
    //     });
    // });

    return new Promise(function (resolve,reject) {
        var obj = jsonfile.readFileSync(file);
        resolve(obj);
    })
}
function writeToMap(obj) {
    this.map = obj;
    //        async return value:
	// return new Promise(function (resolve,reject) {
	// 	jsonfile.writeFile(file,obj,function () {
	// 		resolve(obj);
	// 	});
	// })
    return new Promise(function (resolve,reject) {
        jsonfile.writeFileSync(file,obj);
        resolve(obj);
    })
    
}
function getLength(number) {return number.toString().length;}

var map = require('./map.json');

//database connection variables
{
    var mongoose = require('mongoose');
    var dbUri='mongodb://localhost:27017/authex';
    var dbConnection = mongoose.createConnection(dbUri);
    var Schema = mongoose.Schema;
    var userSchema = new Schema({uid:Number,perms:[String]});
    var User = dbConnection.model('User', userSchema, 'users');
}

module.exports  = {
    init: function () {
      readFromMap();
    },
	userGetter: function (who) {
		return new Promise(function (resolve, reject) {
			User.findOne({uid:who}).exec(function (err,res) {
				if (err) {reject(err);}
				resolve(res.perms);
			});
		});

	},
	userSetter: function (who,newPerms) {
        return new Promise(function (resolve, reject) {
            User.update({uid:who},{uid:who,perms:newPerms},{upsert: true}).exec(function (err, updated) {
                if (err) {reject(err);}
                else {resolve(updated);}
            })
        })
	},
    setUserGetter: function (func) {
        this.userGetter = func;
    },
    setUserSetter: function (func) {
        this.userSetter = func;
    },
	maxPlaceLevel: function () {return map.place.length},
	addPlaceLevel: function () {
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
	},
	addPlace: function (level, name) {
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
                    resolve(resCode);
                }

                //is name unique?
                if(_.findKey(obj.place[level],function (val,key) {return key == name})!=undefined) {
                    console.log("Error: cannot addPlace, name " + name + " already exists.");
                    resCode = -1;
                    resolve(resCode);
                }

                //is name valid?
                if(name == 'all') {
                    console.log("Error: 'all' name is reserved.");
                    resCode = -1;
                    resolve(resCode);
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
                        resolve(resCode);
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
	},
	addCap: function (name) {
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
                    resolve(resCode);
                }

                //is name valid?
                if(name == 'all') {
                    console.log("Error: 'all' name is reserved.");
                    resCode = -1;
                    resolve(resCode);
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
                        resolve(resCode);
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
	},
	getMap: function () {
		return map;
	},
    getMapPromise: function () {
        return Promise.resolve(map);
    },
	setMap: function (mapObj) {
		return new Promise(function (resolve,reject) {
			writeToMap(mapObj).then(function (res) {
				resolve(res);
			})
				.catch(function (err) {
					console.log("write to map: " + err)
				});
		});

	},
    backToSample: function () {
        jsonfile.writeFileSync(__dirname + '/map.json',jsonfile.readFileSync(__dirname + '/~map.json'));
        readFromMap();
    }
};

//for testing purposes
module.exports.usrModel = User;