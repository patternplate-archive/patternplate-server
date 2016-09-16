function layout(props) {
	return `<!doctype html>
	<html>
		<head>
			<title>${props.title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
			${(props.reference.style || [])
				.filter(Boolean)
				.filter(style => Boolean(style.uri))
				.map(style => `<link rel="stylesheet" href="${style.uri}">`)
				.join('\n')}
		</head>
		<body>
			${(props.content.markup || [])
				.filter(Boolean)
				.filter(markup => Boolean(markup.content))
				.map(markup => markup.content)
				.join('\n')}
			${(props.reference.script || [])
				.filter(Boolean)
				.filter(script => Boolean(script.uri))
				.map(script => `<script src="${script.uri}"></script>`)
				.join('\n')}
		</body>
	</html>
	`;
}
export default layout;
