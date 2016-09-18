import {merge} from 'lodash';

import getPatternRetriever from './utilities/get-pattern-retriever';
import layout from '../application/layouts';

export default getPatternDemo;

async function getPatternDemo(application, id, filters, environment) {
	const [pattern] = await getPatternRetriever(application)(id, filters, environment);

	if (!pattern) {
		return null;
	}

	const {formats} = application.configuration.patterns;
	const automount = selectAutoMount(application, pattern);
	const render = getRenderer(formats, automount);

	return render(pattern);
}

function selectAutoMount(a, p) {
	const transform = a.configuration.transforms['react-to-markup'] || {};
	const pattern = selectReactToMarkup(selectManifestOptions(p));
	const settings = merge({}, transform.opts, pattern.opts);
	return settings.automount || false;
}

function selectReactToMarkup(o) {
	return o['react-to-markup'] || {};
}

function selectManifestOptions(p) {
	return p.manifest.options || {};
}

function getRenderer(formats, component = false) {
	return result => {
		const transforms = result.config.transforms;
		const markupFormat = getFormat(formats, transforms, 'markup');
		const styleFormat = getFormat(formats, transforms, 'style');
		const scriptFormat = getFormat(formats, transforms, 'scripts');

		const markupContent = getFileBufferByFormat(result, markupFormat);
		const styleReference = getUriByFormat(result, styleFormat);

		const scriptCandidates = component ?
			[{uri: './component.js'}] :
			[{uri: getUriByFormat(result, scriptFormat)}];

		return layout({
			title: result.id,
			content: {
				markup: [{content: markupContent}].filter(i => i.content)
			},
			reference: {
				style: [{uri: styleReference}].filter(i => i.uri),
				script: scriptCandidates.filter(i => i.uri)
			}
		});
	};
}

const formatNames = {
	markup: 'html',
	style: 'css',
	script: 'js'
};

function getUriByFormat(pattern, format) {
	const outFormats = pattern.outFormats || [];
	const match = outFormats.find(outFormat => outFormat.type === format);
	if (match) {
		return `./index.${match.extension}`;
	}

	return null;
}

function getFileBufferByFormat(pattern, format) {
	const results = Object.values(pattern.results);
	const demoFile = results.find(result => result.name === `demo.${format}`);
	if (demoFile) {
		return demoFile.buffer;
	}

	const indexFile = results.find(result => result.name === `index.${format}`);
	if (indexFile) {
		return indexFile.buffer;
	}

	return null;
}

function getFormat(formats, transforms, type) {
	const entries = Object.entries(formats);
	// try to get a format with matching outFormat
	// markup => html
	// style => css
	// script => js
	const formatName = formatNames[type];
	const found = entries.find(findByOutFormat(formatName, transforms));

	if (found) {
		return found[0];
	}

	// Legacy get format by name
	// {name: 'Format'}
	const legacy = entries.find(findByName(type));
	if (legacy) {
		return legacy[0];
	}

	return null;
}

function findByName(name) {
	return entry => entry[1].name.toLowerCase() === name;
}

function findByOutFormat(name, transforms) {
	return entry => {
		const outFormat = getOutFormat(entry, transforms);
		return name === outFormat;
	};
}

function getOutFormat(entry, transforms) {
	const entryTransforms = entry[1].transforms || [];
	// If no transforms are configured
	// use the inbound transform extension as outFormat
	if (!entryTransforms.length) {
		return entry[0];
	}

	const transformName = entryTransforms[entryTransforms.length - 1];
	const transformConfig = transforms[transformName];
	return transformConfig.outFormat;
}
