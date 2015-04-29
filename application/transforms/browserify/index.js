export default function browserifyTransformFactory (application) {
	return async function browserifyTransform (file, dependencies, demos) {
		return file;
	};
}
