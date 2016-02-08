import {
	extname,
	resolve
} from 'path';

import {
	find
} from 'lodash';

import resolvePathFormatString from '../resolve-utilities/resolve-path-format-string';

export default function getArtifactsToPrune(patterns, artifacts, config) {
	return artifacts.reduce((results, artifact) => {
		const pattern = find(patterns, {id: artifact.id});

		// prune all artifact files without a corresponding pattern
		if (!pattern) {
			return [...results, ...artifact.files];
		}

		// get expected artifact files
		const expected = pattern.files.map(file => {
			const fileExtension = extname(file);
			const formatName = fileExtension.slice(1);

			const format = config.patterns.formats[formatName];

			if (!format) {
				return false;
			}

			const transformNames = format.transforms || [];
			const lastTransformName = transformNames[transformNames.length - 1];
			const lastTransform = config.transforms[lastTransformName] || {};

			const fileType = format.name;
			const targetExtension = lastTransform.outFormat || fileExtension.slice(1);

			const expectedRelativePath = resolvePathFormatString(
				config.resolve,
				pattern.id,
				fileType,
				targetExtension
			);

			return resolve('./distribution', expectedRelativePath);
		}).filter(Boolean);

		// prune artifact files with pattern but no file corresponding
		const files = artifact.files.filter(file => expected.indexOf(file) === -1);
		return [...results, ...files];
	}, []);
}
