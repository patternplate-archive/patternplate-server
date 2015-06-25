function layout (props) {
	return `<!doctype html>
	<html>
		<head>
			<title>${props.title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
			<link rel="icon" type="image/png" href="${props.route('static', { 'path': '/images/favicon-32.png' })}" sizes="32x32" />
			<link rel="icon" type="image/png" href="${props.route('static', { 'path': '/images/favicon-16.png' })}" sizes="16x16" />
			${props.style
				.map((style) => style.wrapper(`<link rel="stylesheet" href="${props.route(null, { 'id': style.uri })}">`))
				.join('\n')}
		</head>
		<body>
			${props.markup
				.filter((markup) => markup.environment === 'index')
				.map((markup) => markup.content)
				.join('\n')}
			${props.script
				.map((script) => script.wrapper(`<script src="${props.route(null, { 'id': script.uri })}"></script>`))
				.join('\n')}
			<script src="${props.route('script', { 'path': 'content.js' })}"></script>
		</body>
	</html>
	`;
}

export default layout;
