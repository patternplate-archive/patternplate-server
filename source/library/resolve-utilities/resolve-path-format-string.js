import {sep as separator} from 'path';
import sprintf from 'sprintf';

function resolvePathFormatString(resolveString, patternId, outputName, extension) {
	return sprintf(resolveString, {
		patternId, outputName, extension
	}).split('/').join(separator);
}

export default resolvePathFormatString;
