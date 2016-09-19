import loadTransforms from './load-transforms';

export default transforms;

async function transforms(application) {
	const transforms = application.configuration.transforms;
	const initTransforms = await loadTransforms(transforms);
	return initTransforms(application);
}

export {loadTransforms};
