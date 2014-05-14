requirejs.onError = function(err) {
	throw err;
};

define(['tree','util'], function(tree, util) {
	util.getJSON('widget').then(function(json) {
		console.log(json);
		var canvas = document.getElementById('root');
		//name, value, elem, level, last, redraw
		tree.draw({
			name: 'json',
			value: json,
			elem: canvas,
			level: 0,
			last: true,
			index: 0,
			count: 1
		});
		tree.dnd();
		tree.editable();
		document.getElementById('showTree').addEventListener('click',function(){
			var json = tree.toJSON(document.getElementById('root').children[0]);
			console.log('JSON', json);
		});
	});
});

