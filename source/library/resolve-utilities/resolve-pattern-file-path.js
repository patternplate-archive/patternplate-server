import {relative, join, basename} from 'path';
import resolvePathFormatString from './resolve-path-format-string';

function resolvePatternFilePath(registry, formatString, resultName, outFormat, localName, patternPath) {
	if (registry[localName]) {
		const {id, path} = registry[localName];
		const treePath = resolvePathFormatString(formatString, id, resultName, outFormat);
		const relativePath = relative(patternPath, path);
		return join(relativePath, basename(treePath));
	}

	return '';
}

export default resolvePatternFilePath;
