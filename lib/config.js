var _ = require('underscore');
var jsonfile = require('jsonfile');
var file = __dirname + '/map.json';
function readFromMap() {return jsonfile.readFileSync(file);}
function writeToMap(obj) {return jsonfile.writeFileSync(file,obj);}
function getLength(number) {return number.toString().length;}

var config = {
	map: require('./map.json'),
	userJsonGetter: function () {},
	userJsonSetter: function () {},
	setFunction: {
		setUserGetter: function (func) {
			this.userJsonGetter = func;
		},
		setUserSetter: function (func) {
			this.userJsonSetter = func;
		}
	},
	maxWhereLevel: function () {return this.map.where.length},
	addWhereLevel: function () {
		var obj = readFromMap();
		obj.where.push({});
		writeToMap(obj);
		return this.maxWhereLevel();
	},
	addWhere: function (level,name) {
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
			resCode = 1;
			return resCode;
		}
	},
	addCap: function (name) {
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
			resCode = 100;
			return resCode;
		}
	},
	getConfig: function () {
		return readFromMap();
	},
	setConfig: function (configObj) {
		writeToMap(configObj);
	}
};

module.exports = config;