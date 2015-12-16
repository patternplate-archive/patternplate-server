import {dirname, sep} from 'path';
import fs from 'q-io/fs';

export default function pathToId(base, path) {
	return fs.relativeFromDirectory(base, dirname(path)).split(sep).join('/');
}
