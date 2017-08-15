import path from 'path';
import chalk from 'chalk';
import {find, flattenDeep, invert, uniqBy} from 'lodash';
import minimatch from 'minimatch';
import exists from 'path-exists';
import throat from 'throat';
import constructDemoDependencies from './construct-demo-dependencies';
import constructDependencies from './construct-dependencies';
import getDependenciesToRead from './get-dependencies-to-read';
import getDemoDependenciesToRead from './get-demo-dependencies-to-read';
import getPatternManifests from '../../utilities/get-pattern-manifests';
import getPatternManifestsData from './get-pattern-manifest-data';
import getReadFile from '../../filesystem/read-file';
import {Pattern} from './';
import readDirectory from '../../filesystem/read-directory';
export default readManifest;

async function readManifest(pattern) {
	const read = getReadFile({cache: pattern.cache});

	if (pattern.config.parents.length === 0) {
		const manifestPath = path.resolve(pattern.path, 'pattern.json');

		if (!await exists(manifestPath)) {
			throw new Error(`Can not read pattern.json from ${pattern.path}, it does not exist.`, {
				fileName: pattern.path,
				pattern: pattern.id
			});
		}

		try {
			const manifestString = await read(manifestPath);
			const manifestData = JSON.parse(manifestString);
			pattern.manifest = {
				version: '0.1.0',
				build: true,
				display: true,
				patterns: {},
				...pattern.manifest,
				...manifestData
			};
		} catch (error) {
			throw new Error(`Error while reading pattern.json from ${pattern.path}: ${error.message}`, {
				file: pattern.path,
				pattern: pattern.id,
				stack: error.stack
			});
		}

		if ('automount' in pattern.options) {
			(((pattern.manifest.options || {})['react-to-markup'] || {}).opts || {}).automount = (pattern.options || {}).automount;
		}

		if (pattern.isEnvironment && !pattern.manifest.patterns) {
			let list = await readDirectory(pattern.base);
			const range = pattern.manifest.range || '*';

			list = list
				.filter(item => path.basename(item) === 'pattern.json')
				.filter(item => !item.includes('@environment'))
				.map(item => path.relative(pattern.base, path.dirname(item)))
				.filter(item => item !== pattern.id);

			if (pattern.manifest.include) {
				const include = Array.prototype.concat.call([], pattern.manifest.include, ['']);
				list = list.filter(item => minimatch(item, `{${include.join(',')}}`));
			}

			if (pattern.manifest.exclude) {
				const exclude = Array.prototype.concat.call([], pattern.manifest.exclude, ['']);
				list = list.filter(item => !minimatch(item, `{${exclude.join(',')}}`));
			}

			pattern.manifest.patterns = list
				.reduce((results, item) => Object.assign(results, {[item]: `${item}@${range}`}), {});
		}

		pattern.manifest.patterns.Pattern = pattern.id; // should be set for demos only?

		const manifestsStart = new Date();

		pattern.log.silly(`Fetching manifests for ${pattern.id}`);
		const pool = await getPatternManifests('.', pattern.base, {cache: pattern.cache});
		const manifests = getPatternManifestsData(pattern.base, {...pattern.manifest.patterns, ...(pattern.manifest.demoPatterns || {})}, pool);
		const manifestDuration = chalk.grey(`[${new Date() - manifestsStart}ms]`);
		pattern.log.silly(`Fetched manifests for ${pattern.id} ${manifestDuration}`);

		const dependencies = uniqBy(flattenDeep(manifests), 'id');

		const dependencyPatterns = dependencies
			.map(manifest => {
				const {id} = manifest;
				const config = {
					...pattern.config,
					parents: [...pattern.config.parents, pattern.id]
				};
				const dep = new Pattern(
					id,
					pattern.base,
					config,
					pattern.transforms,
					{
						...pattern.filters,
						baseNames: ['index'] // dependencies are index-only
					},
					pattern.cache
				);
				dep.manifest = manifest;
				return dep;
			});

		const dependenciesToRead = getDependenciesToRead(pattern.manifest.patterns, dependencyPatterns);
		const demoDependenciesToRead = getDemoDependenciesToRead(pattern.manifest.demoPatterns, dependencyPatterns);

		pattern.log.silly(`Determined dependency chain for ${pattern.id}`);

		dependenciesToRead.forEach(item => {
			const name = invert(pattern.manifest.patterns)[item];
			pattern.log.silly(`↳  ${chalk.bold(name)} → ${item}`);
		});

		const readDependency = async id => {
			return find(dependencyPatterns, {id}).read();
		};

		const readDependencies = await Promise.all(dependenciesToRead.map(throat(1, readDependency)));
		const readDemoDependencies = await Promise.all(demoDependenciesToRead.map(throat(1, readDependency)));

		pattern.dependencies = constructDependencies(pattern.manifest.patterns, readDependencies);
		pattern.demoDependencies = constructDemoDependencies(pattern.manifest.demoPatterns || {}, readDemoDependencies);
	}
}
