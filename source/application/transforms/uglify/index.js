import uglify from 'uglify-js';

export default function uglifyTransformFactory (application) {
	const config = application.configuration.transforms.uglify || {};

	return async function uglifyTransform (file) {
		try {
			let ast = uglify.parse(file.buffer.toString('utf-8'));
			let compressor = uglify.Compressor(config.opts);

			ast.figure_out_scope();
			ast = ast.transform(compressor);
			ast.figure_out_scope();
			ast.compute_char_frequency();
			ast.mangle_names();

			file.buffer = new Buffer(ast.print_to_string(), 'utf-8');
		} catch (err) {
			err.file = file.path;
			throw err;
		}

		file.in = config.inFormat;
		file.out = config.outFormat;

		return file;
	};
}
