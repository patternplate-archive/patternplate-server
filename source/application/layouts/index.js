function layout(props) {
	return `<!doctype html>
	<html>
		<head>
			<title>${props.title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
			<link rel="icon" href="data:;base64,iVBORw0KGgo=">
			${(props.reference.style || [])
				.map(style => `<link rel="stylesheet" href="/api/resource/${style.id}.css">`)
				.join('\n')}
			${(props.content.style || [])
				.map(style => style.wrap === false ? style.content : `<style>${style.content}</style>`)
				.join('\n')}
			${(props.reference.markup || [])
				.map(m => `<link rel="m" href="/api/resource/${m.uri}.html">`)
				.join('\n')}
		</head>
		<body>
			${(props.content.markup || [])
				.map(markup => markup.content)
				.join('\n')}
			${(props.reference.script || [])
				.map(script => `<script src="/api/resource/${script.id}.js"></script>`)
				.join('\n')}
			${props.content.script || []
				.filter(Boolean)
				.filter(script => Boolean(script.content))
				.map(script => script.wrap === false ? script.content : `<script>${script.content}</script>`)
				.join('\n')}
		</body>
	</html>
	`;
}
export default layout;
