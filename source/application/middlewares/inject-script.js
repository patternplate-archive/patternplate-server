export default function injectScriptMiddleware(application, options) {
	return function * injectScriptMiddleware(next) {
		yield* next;
		const src = options.src || '/api/static/js/main.js';
		const snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";

		if (this.response.type && this.response.type.indexOf('html') < 0) {
			return;
		}

		if (Buffer.isBuffer(this.body)) {
			this.body = this.body.toString();
		}

		if (typeof this.body === "string") {
			if(this.body.match(/main.js/)) {
				return;
			}
			this.body = this.body.replace(/<\/body>/, snippet + "<\/body>");
		}

	}
}
