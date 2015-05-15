'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = reactJSXTransformFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*eslint-disable no-loop-func */

var _reactJsx = require('react-jsx');

var _reactJsx2 = _interopRequireDefault(_reactJsx);

var _resolveDependencies = require('./resolve-dependencies');

var _resolveDependencies2 = _interopRequireDefault(_resolveDependencies);

var defaultData = { 'props': {} };

function reactJSXTransformFactory(application) {
	var config = application.configuration.transforms['react-jsx'] || {};

	return function reactJSXTransform(file, demo) {
		var source, sourceTemplate, data, result, demoTemplate, demoData, demoResult;
		return regeneratorRuntime.async(function reactJSXTransform$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					source = file.buffer.toString('utf-8');
					sourceTemplate = _reactJsx2['default'].server(source, { 'raw': true });
					data = Object.assign({}, defaultData, (0, _resolveDependencies2['default'])(file.dependencies));
					result = sourceTemplate(data, { 'html': true });

					file.buffer = new Buffer(result, 'utf-8');
					file['in'] = config.inFormat;
					file.out = config.outFormat;

					if (demo) {
						demoTemplate = _reactJsx2['default'].server(demo.buffer.toString('utf-8'), { 'raw': true });
						demoData = Object.assign({}, data, (0, _resolveDependencies2['default'])({ 'Pattern': file }));
						demoResult = demoTemplate(demoData, { 'html': true });

						file.demoSource = demo.source;
						file.demoBuffer = new Buffer(demoResult, 'utf-8');
					}

					return context$2$0.abrupt('return', file);

				case 9:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

module.exports = exports['default'];