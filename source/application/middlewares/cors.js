import cors from 'koa-cors';

export default function startCorsMiddleware() {
	return cors();
}
