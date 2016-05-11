export default function getMountTransformChain(format, transforms) {
	const formatChanging = format.transforms.findIndex(transformName => {
		const {outFormat} = transforms[transformName];
		return ['js', 'jsx'].indexOf(outFormat) === -1;
	});

	const index = formatChanging === -1 ?
		format.transforms.length :
		formatChanging;

	return format.transforms
		.slice(0, index)
		.concat(['react-mount', 'browserify']);
}
