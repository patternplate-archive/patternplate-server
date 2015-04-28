export default function lessTransformFactory (application) {
	return async function lessTransform (file) {
		return file;
	};
}
