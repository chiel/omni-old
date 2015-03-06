'use strict';

var renderNav = function(nodes){
	var html = [], i, node;
	html.push('<ul>');

	for (i = 0; i < nodes.length; i++){
		node = nodes[i];
		html.push('<li>');
		if (node.url){
			html.push('<a href="', node.slug, '">', node.label, '</a>');
		} else {
			html.push('<span>', node.label, '</span>');
		}
		if (node.children && node.children.length){
			html.push(renderNav(node.children));
		}
		html.push('</li>');
	}

	html.push('</ul>');
	return html.join('');
};

renderNav.safe = true;
module.exports = renderNav;
