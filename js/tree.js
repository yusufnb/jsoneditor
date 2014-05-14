define(['util'], function (util) {
	'use strict';

	function isScalar(type) {
		if (type !== 'array' && type !== 'object') return true;
		else return false;
	}

	function getNode(obj) {
		obj.type = util.getType(obj.value);
		var node = document.createElement('div');
		node.classList.add('node');
		node.setAttribute('draggable', true);
		for(var i in obj) {
			if (!isScalar(util.getType(obj[i]))) continue;
			node.setAttribute("data-" + i, obj[i]);
		}
		if (obj.name) {
			var name = document.createElement('span');
			name.classList.add('name');
			name.innerText = obj.name;
			node.appendChild(name);
		}
		if (obj.type !== 'object' && obj.type !== 'array') {
			var value = document.createElement('span');
			value.innerText = JSON.stringify(obj.value);
			node.appendChild(value);
		}
		node['_'] = obj;
		return node;
	}

	var self = {};

	self.toJSON = function(elem) {

		function build(elem) {
			var meta = elem._;
			if (isScalar(meta.type)) return meta.value;
			var value = (meta.type === 'object') ? {} : [];

			var kids = elem.querySelectorAll(":scope > .node");
			for (var i=0; i<kids.length; i++) {
				var node = kids[i];
				if (meta.type === 'object') {
					if (isScalar(node._.type)) value[node._.name] = node._.value;
					else value[node._.name] = build(node);
				} else {
					if (isScalar(node._.type)) value.push(node._.value);
					else value.push(build(node));
				}
			};

			return value;
		};

		return build(elem);
	}

	function getBrace(b) {
		var elem = document.createElement('span');
		elem.innerText = b;
		return elem;
	}

	function clear(elem) {
		elem.innerHTML = '';
	}

	// name, value, elem, level, last, redraw
	self.draw = function(args) {
		var node;
		var type = util.getType(args.value);

		if (!args.redraw) {
			node = getNode(args);
			args.elem.appendChild(node);
		} else {
			node = args.elem;
		}

		if (type === 'array' || type === 'object') {
			var i=0;
			var len = Object.keys(args.value).length;
			for (var k in args.value) {
				self.draw({
					name: k,
					value: args.value[k],
					elem: node,
					level: args.level + 1,
					redraw: false,
					index: i,
					count: len
				});
				i++;
			}
		}
	}

	self.redraw = function(elem) {
		var json = self.toJSON(elem);
		console.log(json);
	}

	self.dnd = function() {
		var node = document.getElementById('root').children[0];
		var dragged = null;
		function dragClear() {
			var over = document.getElementById('root').querySelectorAll('.over');
			for (var i =0; i<over.length; i++) over[i].classList.remove('over');
		}
		function dragHover(elem) {
			dragClear();
			elem.classList.add('over');
		}
		function getParentNode(elem) {
			do {
				var parent = elem.parentElement;
			} while(parent && !parent.classList.contains('node'));
			return parent;
		}

		node.addEventListener('dragstart', function(e){
			if (e.target && e.target.classList.contains('node')) {
				dragged = e.target;
			}
		});
		node.addEventListener('dragover', function(e) {
			e.preventDefault();
		})
		node.addEventListener('dragenter', function(e) {
			if (e.target && e.target.classList.contains('node')) {
				dragHover(e.target);
			} else {
				dragHover(getParentNode(e.target));
			}
		});
		node.addEventListener('dragleave', function(e) {
			if (e.target && e.target.classList.contains('node')) {
				//	e.target.classList.remove('over');
			}
		});
		node.addEventListener('drop', function(e) {
			console.log('Dropped',e);
			var target = (e.target && e.target.classList.contains('node')) ? e.target : getParentNode(e.target);
			e.preventDefault();
			if (isScalar(target._.type) || util.isShift) {
				var parent = getParentNode(target);
				parent.insertBefore(dragged, target);
				self.redraw(parent);
			} else {
				target.appendChild(dragged);
				self.redraw(target);
			}
			dragged = null;
			dragClear();
		});
	}

	self.editable = function() {
		var root = document.getElementById('root');
		root.addEventListener('click', function(e){
			if (e.target.tagName.toLowerCase() === 'span') {
				e.target.setAttribute('contenteditable', true);
				e.target.focus();
			}
		})
	}

	return self;
});