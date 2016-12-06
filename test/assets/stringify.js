'use strict';

export default function stringify(node, options) {
	options = options || {};
	const children = node.children.map(child => stringify(child, options)).join('');

	if (!node.parent && node.isGroup) {
		// a root container: return its content only
		return children;
	} else if (node.isGroup) {
		// grouping node
		return options.omitGroups
			? children
			: `(${children})${counter(node, options)}`;
	} else if (node.value && !node.name && !node.attributes.length) {
		// text node
		return node.value + children;
	}

	const attr = node.attributes.map(a => {
		a = node.getAttribute(a.name);
		return (!a.options.implied || a.value != null) ? ` ${a.name}="${a.value || ''}"` : '';
	}).join('');
	const name = node.name || '?';

	return node.selfClosing
		? `<${name}${counter(node, options)}${attr} />`
		: `<${name}${counter(node, options)}${attr}>${node.value || ''}${children}</${name}>`;
}

function counter(node, options) {
	if (!node.repeat || options.skipRepeat) {
		return '';
	}

	let out = `*${node.repeat.count}`;
	if (node.repeat.value != null) {
		out += `@${node.repeat.value}`;
	}

	return out;
}
