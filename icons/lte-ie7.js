/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-cancel' : '&#xe000;',
			'icon-star' : '&#xe007;',
			'icon-checkmark' : '&#xe002;',
			'icon-x' : '&#xe003;',
			'icon-checkmark-2' : '&#xe004;',
			'icon-key' : '&#xe005;',
			'icon-key-2' : '&#xe006;',
			'icon-arrow-up-right' : '&#xe008;',
			'icon-arrow-up-left' : '&#xe001;',
			'icon-arrow-down-right' : '&#xe009;',
			'icon-arrow-down-left' : '&#xe00a;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};