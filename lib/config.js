var _ = require('underscore');
var jsonfile = require('jsonfile');
jsonfile.spaces = 4;
var file = __dirname + '/map.json';
function readFromMap() {
    config.map = jsonfile.readFileSync(file);
    return config.map;
}
function writeToMap(obj) {
    config.map = obj;
    return jsonfile.writeFileSync(file,obj);
}
function getLength(number) {return number.toString().length;}

{
    var mongoose = require('mongoose');
    var dbUri='mongodb://localhost:27017/authex';
    var dbConnection = mongoose.createConnection(dbUri);
    var Schema = mongoose.Schema;
    var userSchema = new Schema({uid:Number,perms:[String]});
    var User = dbConnection.model('User', userSchema, 'users');
}

var config = {
	map: require('./map.json'),
    loadMap: function () {
      this.map = readFromMap();
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
	maxWhereLevel: function () {return this.map.where.length},
	addWhereLevel: function () {
		var obj = readFromMap();
		obj.where.push({});
		writeToMap(obj);
		return this.maxWhereLevel();
	},
	addWhere: function (level,name) {
		name = name.toLowerCase();
		var resCode;
		var obj = readFromMap();
		var codes = _.values(obj.where[level]);
		//validations

		//is level valid?
		if (obj.where.length<level) {
			console.log("Error: cannot addWhere, level " + level + " doesn't exists.");
			resCode = -1;
			return resCode;
		}

		//is name unique?
		if(_.findKey(obj.where[level],function (val,key) {return key == name})!=undefined) {
			console.log("Error: cannot addWhere, name " + name + " already exists.");
			resCode = -1;
			return resCode;
		}

		//is name valid?
		if(name == 'all') {
			console.log("Error: 'all' name is reserved.");
			resCode = -1;
			return resCode;
		}

		if (!_.isEmpty(codes)) {
			var maxValue = _.max(codes);
			var digits = getLength(maxValue);
			var maxValid = Math.pow(10,digits)-1;
			//is valid
			if (maxValue<maxValid) {
				obj.where[level][name]=maxValue + 1;
				writeToMap(obj);
				resCode = maxValue+1;
				return resCode;
			} else {
				//is not valid
				console.log("Error: cannot addWhere, level " + level + " is full!.");
				resCode = -1;
				return resCode;
			}
		} else {
			//how many digits do you want?
			//create one! 1, 10, 100, 1000, ...

			//for now for example 1 digit.
			obj.where[level][name]=1;
            writeToMap(obj);
			resCode = 1;
			return resCode;
		}
	},
	addCap: function (name) {
		name = name.toLowerCase();
		var resCode;
		var obj = readFromMap();
		var codes = _.values(obj.what);
		//validations

		//is name unique?
		if(_.findKey(obj.what,function (val,key) {return key == name})!=undefined) {
			console.log("Error: cannot addCap, name " + name + " already exists.");
			resCode = -1;
			return resCode;
		}

		//is name valid?
		if(name == 'all') {
			console.log("Error: 'all' name is reserved.");
			resCode = -1;
			return resCode;
		}

		if (!_.isEmpty(codes)) {
			var maxValue = _.max(codes);
			var digits = getLength(maxValue);
			var maxValid = Math.pow(10,digits)-1;
			//is valid
			if (maxValue<maxValid) {
				obj.what[name]=maxValue + 1;
				writeToMap(obj);
				resCode = maxValue+1;
				return resCode;
			} else {
				//is not valid
				console.log("Error: cannot addCap, Caps is full!.");
				resCode = -1;
				return resCode;
			}
		} else {
			//how many digits do you want?
			//create one! 1, 10, 100, 1000, ...

			//for now for example 3 digit.
			obj.what[name] = 100;
            writeToMap(obj);
			resCode = 100;
			return resCode;
		}
	},
	getConfig: function () {
		return readFromMap();
	},
	setConfig: function (configObj) {
		writeToMap(configObj);
	},

    backToTemp: function () {
        var tempMap = require('./~map.json');
        writeToMap(tempMap);
        this.map = tempMap;
    }
};

module.exports = config;