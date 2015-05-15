export default function JSONErrorFactory (application) {
	return function * jsonErrorMiddlewares (next) {
		try {
			yield next;
		} catch (error) {
			error.expose = true;
			this.response.status = error.status || 404;

			let message = [
				'Error',
				error.pattern ? `in "${error.pattern}"` : '',
				error.transform ? `during transform "${error.transform}" of` : '',
				error.file ? `"${error.file}":` : 'unknown file:',
				error.message ? error.message : ''
			].filter((item) => item).join(' ');

			application.log.error(message);
			application.log.debug(error.stack ? error.stack : new Error(error).stack);

			switch (this.accepts('json', 'html', 'text')) {
				case 'json':
					this.type = 'json';
					this.body = {
						'message': message,
						'pattern': error.pattern,
						'transform': error.transform,
						'file': error.file,
						'stack': error.stack
					};
					break;
				default:
					let text = [
						'Message: ' + message,
						'Pattern: ' + error.pattern,
						'Transform: ' + error.transform,
						'File: ' + error.file,
						error.stack].join('\n');

					this.body = text;
					break;
			}
		}
	};
}
