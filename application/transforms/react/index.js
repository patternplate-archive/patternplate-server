'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = createReactCodeFactory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _reactClassTmpl = require('./react-class.tmpl');

var _reactClassTmpl2 = _interopRequireDefault(_reactClassTmpl);

function createReactCodeFactory(application) {
	var config = application.configuration.transforms['react'] || {};

	return function createReactCode(file, demo) {
		var result, demoResult;
		return regeneratorRuntime.async(function createReactCode$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					result = convertCode(file);

					if (demo) {
						demo.dependencies = {
							pattern: file
						};
						demoResult = convertCode(demo);

						file.demoSource = demo.source;
						file.demoBuffer = new Buffer(demoResult, 'utf-8');
					}

					file.buffer = result;
					file['in'] = config.inFormat;
					file.out = config.outFormat;
					return context$2$0.abrupt('return', file);

				case 6:
				case 'end':
					return context$2$0.stop();
			}
		}, null, this);
	};
}

function convertCode(file) {
	var source = file.buffer.toString('utf-8');
	if (source.indexOf('export default class') === -1 || source.indexOf('React.createClass') !== -1) {
		source = createWrappedRenderFunction(file, source);
	}
	var dependencies = convertDependencies(file);
	return fixDependencyImports(source, dependencies);
}

function convertDependencies(file) {
	var dependencies = {};
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(file.dependencies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var dependencyName = _step.value;

			var dependencyFile = file.dependencies[dependencyName];
			dependencies[dependencyName] = convertCode(dependencyFile);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return dependencies;
}

function fixDependencyImports(source, dependencies) {
	// Replace import statements (but react) with a dumb module loader
	return source.replace(/^\s*import\s+(?:\*\s+as\s+)?([^R][^e][^a][^c][^t].*?)\s+from\s+['"]([-_a-zA-Z0-9]+)['"].*$/gm, function (match, name, module) {
		return 'let ' + name + ' = (() => {\n\t\t\t' + dependencies[module].replace("import * as React from 'react';", '').replace('export default ', 'return ') + '\n\t\t})();\n\t\t';
	});
}

function createWrappedRenderFunction(file, source, className) {
	var patternJson = loadPatternJson(file.path);
	var dependencies = writeDependencyImports(file).join('\n');

	return renderCodeTemplate(source, dependencies, _reactClassTmpl2['default'], className ? className : (0, _pascalCase2['default'])(patternJson.name));
}

function writeDependencyImports(file) {
	var dependencies = [];
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Object.keys(file.dependencies)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var dependencyName = _step2.value;

			dependencies.push('import ' + (0, _pascalCase2['default'])(dependencyName) + ' from \'' + dependencyName + '\';');
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2['return']) {
				_iterator2['return']();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return dependencies;
}

function renderCodeTemplate(source, dependencies, template, className) {
	return template.replace('$$dependencies$$', dependencies).replace('$$class-name$$', className).replace('$$render-code$$', matchFirstJsxExpressionAndWrapWithReturn(source));
}

function matchFirstJsxExpressionAndWrapWithReturn(source) {
	return source.replace(/(<[a-z0-9]+(?:\s+[a-z0-9]+=["{][^"}]*?["}])*\s*\/?>[^]*)/gi, 'return (\n$1\n);');
}

function loadPatternJson(path) {
	return require((0, _path.join)(path.substring(0, path.lastIndexOf('/')), 'pattern.json'));
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9hcHBsaWNhdGlvbi90cmFuc2Zvcm1zL3JlYWN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUl3QixzQkFBc0I7Ozs7b0JBSjNCLE1BQU07OzBCQUNGLGFBQWE7Ozs7OEJBQ2Ysb0JBQW9COzs7O0FBRTFCLFNBQVMsc0JBQXNCLENBQUMsV0FBVyxFQUFFO0FBQzNELEtBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFbkUsUUFBTyxTQUFlLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSTtNQUMzQyxNQUFNLEVBS0wsVUFBVTs7OztBQUxYLFdBQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDOztBQUM5QixTQUFJLElBQUksRUFBRTtBQUNULFVBQUksQ0FBQyxZQUFZLEdBQUc7QUFDbkIsY0FBTyxFQUFFLElBQUk7T0FDYixDQUFDO0FBQ0UsZ0JBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDOztBQUNsQyxVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDOUIsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDbEQ7O0FBRUQsU0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsU0FBSSxNQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUMxQixTQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7eUNBQ3JCLElBQUk7Ozs7Ozs7RUFDWCxDQUFBO0NBQ0Q7O0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQzFCLEtBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLEtBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFB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QUMsQ0FBQyxDQUFDO0NBQzVDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtqb2lufSBmcm9tICdwYXRoJztcbmltcG9ydCBwYXNjYWxDYXNlIGZyb20gJ3Bhc2NhbC1jYXNlJztcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3JlYWN0LWNsYXNzLnRtcGwnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVSZWFjdENvZGVGYWN0b3J5KGFwcGxpY2F0aW9uKSB7XG5cdGNvbnN0IGNvbmZpZyA9IGFwcGxpY2F0aW9uLmNvbmZpZ3VyYXRpb24udHJhbnNmb3Jtc1sncmVhY3QnXSB8fCB7fTtcblxuXHRyZXR1cm4gYXN5bmMgZnVuY3Rpb24gY3JlYXRlUmVhY3RDb2RlKGZpbGUsIGRlbW8pIHtcblx0XHRsZXQgcmVzdWx0ID0gY29udmVydENvZGUoZmlsZSk7XG5cdFx0aWYgKGRlbW8pIHtcblx0XHRcdGRlbW8uZGVwZW5kZW5jaWVzID0ge1xuXHRcdFx0XHRwYXR0ZXJuOiBmaWxlXG5cdFx0XHR9O1xuXHRcdFx0bGV0IGRlbW9SZXN1bHQgPSBjb252ZXJ0Q29kZShkZW1vKTtcblx0XHRcdGZpbGUuZGVtb1NvdXJjZSA9IGRlbW8uc291cmNlO1xuXHRcdFx0ZmlsZS5kZW1vQnVmZmVyID0gbmV3IEJ1ZmZlcihkZW1vUmVzdWx0LCAndXRmLTgnKTtcblx0XHR9XG5cblx0XHRmaWxlLmJ1ZmZlciA9IHJlc3VsdDtcblx0XHRmaWxlLmluID0gY29uZmlnLmluRm9ybWF0O1xuXHRcdGZpbGUub3V0ID0gY29uZmlnLm91dEZvcm1hdDtcblx0XHRyZXR1cm4gZmlsZTtcblx0fVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0Q29kZShmaWxlKSB7XG5cdGxldCBzb3VyY2UgPSBmaWxlLmJ1ZmZlci50b1N0cmluZygndXRmLTgnKTtcblx0aWYgKHNvdXJjZS5pbmRleE9mKCdleHBvcnQgZGVmYXVsdCBjbGFzcycpID09PSAtMSB8fCBzb3VyY2UuaW5kZXhPZignUmVhY3QuY3JlYXRlQ2xhc3MnKSAhPT0gLTEpXHQge1xuXHRcdHNvdXJjZSA9IGNyZWF0ZVdyYXBwZWRSZW5kZXJGdW5jdGlvbihmaWxlLCBzb3VyY2UpO1xuXHR9XG5cdGxldCBkZXBlbmRlbmNpZXMgPSBjb252ZXJ0RGVwZW5kZW5jaWVzKGZpbGUpO1xuXHRyZXR1cm4gZml4RGVwZW5kZW5jeUltcG9ydHMoc291cmNlLCBkZXBlbmRlbmNpZXMpO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0RGVwZW5kZW5jaWVzKGZpbGUpIHtcblx0bGV0IGRlcGVuZGVuY2llcyA9IHt9O1xuXHRmb3IgKGxldCBkZXBlbmRlbmN5TmFtZSBvZiBPYmplY3Qua2V5cyhmaWxlLmRlcGVuZGVuY2llcykpIHtcblx0XHRsZXQgZGVwZW5kZW5jeUZpbGUgPSBmaWxlLmRlcGVuZGVuY2llc1tkZXBlbmRlbmN5TmFtZV07XG5cdFx0ZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3lOYW1lXSA9IGNvbnZlcnRDb2RlKGRlcGVuZGVuY3lGaWxlKTtcblx0fVxuXHRyZXR1cm4gZGVwZW5kZW5jaWVzO1xufVxuXG5mdW5jdGlvbiBmaXhEZXBlbmRlbmN5SW1wb3J0cyhzb3VyY2UsIGRlcGVuZGVuY2llcykge1xuXHQvLyBSZXBsYWNlIGltcG9ydCBzdGF0ZW1lbnRzIChidXQgcmVhY3QpIHdpdGggYSBkdW1iIG1vZHVsZSBsb2FkZXJcblx0cmV0dXJuIHNvdXJjZS5yZXBsYWNlKC9eXFxzKmltcG9ydFxccysoPzpcXCpcXHMrYXNcXHMrKT8oW15SXVteZV1bXmFdW15jXVtedF0uKj8pXFxzK2Zyb21cXHMrWydcIl0oWy1fYS16QS1aMC05XSspWydcIl0uKiQvZ20sIChtYXRjaCwgbmFtZSwgbW9kdWxlKSA9PiB7XG5cdFx0cmV0dXJuIGBsZXQgJHtuYW1lfSA9ICgoKSA9PiB7XG5cdFx0XHQke2RlcGVuZGVuY2llc1ttb2R1bGVdLnJlcGxhY2UoXCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XCIsICcnKS5yZXBsYWNlKCdleHBvcnQgZGVmYXVsdCAnLCAncmV0dXJuICcpfVxuXHRcdH0pKCk7XG5cdFx0YDtcblx0fSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlV3JhcHBlZFJlbmRlckZ1bmN0aW9uKGZpbGUsIHNvdXJjZSwgY2xhc3NOYW1lKSB7XG5cdGxldCBwYXR0ZXJuSnNvbiA9IGxvYWRQYXR0ZXJuSnNvbihmaWxlLnBhdGgpO1xuXHRsZXQgZGVwZW5kZW5jaWVzID0gd3JpdGVEZXBlbmRlbmN5SW1wb3J0cyhmaWxlKS5qb2luKCdcXG4nKTtcblxuXHRyZXR1cm4gcmVuZGVyQ29kZVRlbXBsYXRlKFxuXHRcdHNvdXJjZSwgXG5cdFx0ZGVwZW5kZW5jaWVzLFxuXHRcdHRlbXBsYXRlLFxuXHRcdGNsYXNzTmFtZSA/IGNsYXNzTmFtZSA6IHBhc2NhbENhc2UocGF0dGVybkpzb24ubmFtZSkpO1xufVxuXG5mdW5jdGlvbiB3cml0ZURlcGVuZGVuY3lJbXBvcnRzKGZpbGUpIHtcblx0bGV0IGRlcGVuZGVuY2llcyA9IFtdO1xuXHRmb3IgKGxldCBkZXBlbmRlbmN5TmFtZSBvZiBPYmplY3Qua2V5cyhmaWxlLmRlcGVuZGVuY2llcykpIHtcblx0XHRkZXBlbmRlbmNpZXMucHVzaChgaW1wb3J0ICR7cGFzY2FsQ2FzZShkZXBlbmRlbmN5TmFtZSl9IGZyb20gJyR7ZGVwZW5kZW5jeU5hbWV9JztgKTtcblx0fVxuXHRyZXR1cm4gZGVwZW5kZW5jaWVzO1xufVxuXG5mdW5jdGlvbiByZW5kZXJDb2RlVGVtcGxhdGUoc291cmNlLCBkZXBlbmRlbmNpZXMsIHRlbXBsYXRlLCBjbGFzc05hbWUpIHtcblx0cmV0dXJuIHRlbXBsYXRlXG5cdFx0LnJlcGxhY2UoJyQkZGVwZW5kZW5jaWVzJCQnLCBkZXBlbmRlbmNpZXMpXG5cdFx0LnJlcGxhY2UoJyQkY2xhc3MtbmFtZSQkJywgY2xhc3NOYW1lKVxuXHRcdC5yZXBsYWNlKCckJHJlbmRlci1jb2RlJCQnLCBtYXRjaEZpcnN0SnN4RXhwcmVzc2lvbkFuZFdyYXBXaXRoUmV0dXJuKHNvdXJjZSkpO1xufVxuXG5mdW5jdGlvbiBtYXRjaEZpcnN0SnN4RXhwcmVzc2lvbkFuZFdyYXBXaXRoUmV0dXJuKHNvdXJjZSkge1xuXHRyZXR1cm4gc291cmNlXG5cdFx0LnJlcGxhY2UoLyg8W2EtejAtOV0rKD86XFxzK1thLXowLTldKz1bXCJ7XVteXCJ9XSo/W1wifV0pKlxccypcXC8/PlteXSopL2dpLCBcblx0XHRcdCdyZXR1cm4gKFxcbiQxXFxuKTsnKVxufVxuXG5mdW5jdGlvbiBsb2FkUGF0dGVybkpzb24ocGF0aCkge1xuXHRyZXR1cm4gcmVxdWlyZShcblx0XHRqb2luKFxuXHRcdFx0cGF0aC5zdWJzdHJpbmcoMCwgXG5cdFx0XHRcdHBhdGgubGFzdEluZGV4T2YoJy8nKSksICdwYXR0ZXJuLmpzb24nKSk7XG59XG4iXX0=