import {merge} from 'lodash';

import getPatternRetriever from './utilities/get-pattern-retriever';
import getPatternSource from './get-pattern-source';
import layout from '../application/layouts';

export default getPatternDemo;

async function getPatternDemo(application, id, filters, environment) {
	const getFile = getPatternSource(application);
	const [pattern] = await getPatternRetriever(application)(id, filters, environment, ['read']);

	if (!pattern) {
		return null;
	}

	const order = ['demo', 'index'];

	const path = Object.values(pattern.files)
		.sort((a, b) => order.indexOf(a.basename) - order.indexOf(b.basename))
		.map(file => file.path)[0];

	if (!path) {
		return null;
	}

	const content = await getFile(path, 'transformed', environment);

	const {formats} = application.configuration.patterns;
	const automount = selectAutoMount(application, pattern);
	const render = getRenderer(formats, automount);

	return render(content.body, pattern);
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
	return (content, result) => {
		const transforms = result.config.transforms;
		const styleFormat = getFormat(formats, transforms, 'style');
		const scriptFormat = getFormat(formats, transforms, 'script');

		const styleReference = getUriByFormat(result, styleFormat);

		const scriptCandidates = component ?
			[{uri: './component.js'}] :
			[{uri: getUriByFormat(result, scriptFormat)}];

		return layout({
			title: result.id,
			content: {
				markup: [{content}]
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
