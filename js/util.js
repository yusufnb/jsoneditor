define(function(){
	'use strict';
	window.addEventListener('keydown', function(e) {
		if (e.shiftKey) self.isShift = true;
	})
	window.addEventListener('keyup', function(e) {
		if (!e.shiftKey) self.isShift = false;
	})
	var self = {
		getJSON: function (x) {
			var xhr = new XMLHttpRequest();
			var promise = new Promise(function(resolve, reject) {
				xhr.open('GET', 'files/' + x + '.json', true);
				xhr.onreadystatechange = function(e) {
					if (this.readyState == 4 && this.status == 200) {
						var json = eval('(' + this.responseText + ')');
						resolve(json);
					}
				}
				xhr.send();
			});
			return promise;
		},
		getType: function (x) {
			if (_.isArray(x)) return 'array';
			if (_.isObject(x)) return 'object';
			if (_.isString(x)) return 'string';
			if (_.isNumber(x)) return 'number';
			if (_.isBoolean(x)) return 'bool';
			if (_.isNull(x)) return 'null';
			if (_.isRegExp(x)) return 'regexp';
			if (_.isUndefined(x)) return 'undefined';
		},
		isShift: false
	};
	return self;
})