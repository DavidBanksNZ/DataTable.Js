export function isObject (obj) {
	return obj !== null && Object.prototype.toString.call(obj) === '[object Object]';
}