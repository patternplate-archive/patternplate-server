export default function browserifyTransformFactory (application) {
	return async function browserifyTransform (file) {
		return file;
	};
}
