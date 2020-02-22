// Ensure correct dirty checks when Svelte is running in immutable mode.
export function clone(object) {
	if ('object' === typeof object) {
		if (null === object) return object;
		if (Array.isArray(object)) return [...object];
		if (object instanceof Set) return new Set(object);
		if (object instanceof Map) return new Map(object);
		return Object.assign({}, object);
	}
	return object;
}
