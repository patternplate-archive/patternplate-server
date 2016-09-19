import {last, merge, uniq} from 'lodash';
import getTransform from './get-transform';
import toString from './to-string';

export default transform;

async function transform(pattern) {
	const formats = pattern.config.patterns.formats;

	const config = {
		patterns: pattern.config.patterns,
		transformConfigs: pattern.config.transforms,
		log: pattern.log
	};

	// get the transform job, execute in parallel
	const jobs = Object.values(pattern.files)
		.map(getTransform(pattern.transforms, config));

	// get an array with the results of each transform step
	const filesResults = await Promise.all(jobs);

	// pick the last item each
	const transformResults = filesResults.map(last);

	// Save into files map
	const files = transformResults.reduce((results, transformResult) => {
		results[transformResult.name] = transformResult;
		return results;
	}, {});

	merge(pattern.files, files);

	// Join demo and index files of the same format
	// if there is a demo, it occupies the results[format.name] key
	const sanitizedResults = uniq(transformResults.reduce((results, result) => {
		const demo = transformResults.find(transformResult => {
			return transformResult.basename === 'demo' && transformResult.format === result.format;
		});

		if (demo) {
			results.push(demo);
		} else {
			results.push(result);
		}

		return results;
	}, []));

	// Reduce to format.name => result map
	pattern.results = sanitizedResults.reduce((results, transformResult) => {
		const format = formats[transformResult.format];
		const source = toString(transformResult.source);
		const buffer = toString(transformResult.buffer);

		const base = {
			name: transformResult.name,
			concern: transformResult.basename,
			source,
			buffer,
			in: transformResult.in,
			out: transformResult.out
		};

		const amend = transformResult.baseName === 'demo' ? {
			demoBuffer: toString(transformResult.demoBuffer),
			demoSource: toString(transformResults.demoSource)
		} : {};
		results[format.name] = merge(base, amend);
		return results;
	}, {});

	pattern.meta = Object.entries(pattern.files).reduce((results, entry) => {
		const [, file] = entry;
		const meta = file.meta || {};
		const dependencies = meta.dependencies || [];
		const devDependencies = meta.devDependencies || [];
		const scriptDependencies = meta.scripts || [];
		return {
			...results,
			dependencies: [...(results.dependencies || []), ...dependencies],
			devDependencies: [...(results.devDependencies || []), ...devDependencies],
			scriptDependencies: [...(results.scriptDependencies || []), ...scriptDependencies]
		};
	}, {});
}
