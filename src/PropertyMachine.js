import { Machine, assign } from 'xstate';

// Ensure correct dirty checks when Svelte is running in immutable mode.
function clone(object) {
	if ('object' === typeof object) {
		if (null === object) return object;
		if (Array.isArray(object)) return [...object];
		if (object instanceof Set) return new Set(object);
		if (object instanceof Map) return new Map(object);
		return Object.assign({}, object);
	}
	return object;
}

export const machine = key => {
	const CONTEXT_KEY = key || 'property';
	const CACHE_KEY = `${CONTEXT_KEY}_cache`;
	return Machine(
		{
			id: key,
			strict: true,
			initial: 'viewing',
			context: {},
			states: {
				editing: {
					initial: 'clean',
					entry: 'doCache',
					exit: 'undoCache',
					actions: 'focusInput',
					states: {
						clean: {
							on: {
								change: {
									target: 'dirty',
									internal: true
								}
							}
						},
						dirty: {
							entry: 'doChange',
							on: {
								change: {
									actions: 'doChange'
								},
								cancel: {
									target: 'clean',
									actions: 'undoCache'
								}
							}
						}
					},
					on: {
						blur: {
							target: '../viewing',
							internal: false
						}
					}
				},
				viewing: {
					on: {
						focus: { target: 'editing' }
					}
				}
			}
		},
		{
			actions: {
				doChange: assign({
					[CONTEXT_KEY]: (c, e) => clone({ ...e[CONTEXT_KEY], timestamp: null })
				}),
				doCache: assign({ [CACHE_KEY]: (c, e) => clone(c[CONTEXT_KEY]) }),
				undoCache: assign({
					[CONTEXT_KEY]: (c, e) => clone(c[CACHE_KEY])
				})
			}
		}
	);
};
