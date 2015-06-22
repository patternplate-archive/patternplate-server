'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
function layout(props) {
	return '<!doctype html>\n\t<html>\n\t\t<head>\n\t\t\t<title>' + props.title + '</title>\n\t\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\n\t\t\t<link rel="icon" type="image/png" href="/static/images/favicon-32.png" sizes="32x32" />\n\t\t\t<link rel="icon" type="image/png" href="/static/images/favicon-16.png" sizes="16x16" />\n\t\t\t' + props.style.map(function (style) {
		return style.wrapper('<link rel="stylesheet" href="' + style.uri + '">');
	}).join('\n') + '\n\t\t</head>\n\t\t<body>\n\t\t\t' + props.markup.filter(function (markup) {
		return markup.environment === 'index';
	}).map(function (markup) {
		return markup.content;
	}).join('\n') + '\n\t\t\t' + props.script.map(function (script) {
		return script.wrapper('<script src="' + script.uri + '"></script>');
	}).join('\n') + '\n\t\t\t<script src="/script/content.js"></script>\n\t\t</body>\n\t</html>\n\t';
}

exports['default'] = layout;
module.exports = exports['default'];