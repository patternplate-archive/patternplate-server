import path from 'path';

export default layout;

function layout(props) {
	const styleRefs = (props.reference.style || []).filter(isReference);
	const scriptRefs = (props.reference.script || []).filter(isReference);

	return `<!doctype html>
	<html>
		<head>
			<title>${props.title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
			<link rel="icon" href="data:;base64,iVBORw0KGgo=">
			${styleRefs
				.filter(isAbsolute)
				.map(style => `<link rel="stylesheet" href="/api/resource/${style.id}.css">`)
				.join('\n')}
			${styleRefs
				.filter(isRelative)
				.map(style => `<link rel="stylesheet" href="${style.uri || style.id}">`)
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
			${scriptRefs
				.filter(isAbsolute)
				.map(script => `<script src="/api/resource/${script.id}.js"></script>`)
				.join('\n')}
			${scriptRefs
				.filter(isRelative)
				.map(script => `<script src="${script.uri || script.id}"></script>`)
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

function isAbsolute(reference) {
	return !isRelative(reference) && !hasUri(reference);
}

function isReference(reference) {
	return 'id' in reference || 'uri' in reference;
}

function isRelative(reference) {
	return (reference.id || '').charAt(0) === '.' || hasUri(reference);
}

function hasUri(reference) {
	return 'uri' in reference;
}
