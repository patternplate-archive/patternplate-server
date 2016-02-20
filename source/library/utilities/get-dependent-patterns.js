import getPatternManifests from './get-pattern-manifests';

export default async function getDependentPatterns(id, base, options) {
	const manifests = await getPatternManifests('.', base, options);
	return manifests.reduce((results, manifest) => {
		const isDependency = Object.values(manifest.patterns || {}).indexOf(id) > -1;
		return isDependency ? {...results, [manifest.id]: manifest} : results;
	}, {});
}

