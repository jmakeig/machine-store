import { Machine, assign } from 'xstate';
import { clone } from './util.js';

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
				viewing: {
					on: {
						focus: {
							target: 'editing',
							actions: 'focusInput'
						}
					}
				},
				editing: {
					initial: 'clean',
					entry: 'doCache',
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
							target: 'viewing',
							internal: false
						}
					}
				}
			}
		},
		{
			actions: {
				doChange: assign({
					[CONTEXT_KEY]: (c, e) => clone({ ...e[CONTEXT_KEY] })
				}),
				doCache: assign({ [CACHE_KEY]: (c, e) => clone(c[CONTEXT_KEY]) }),
				undoCache: assign({
					[CONTEXT_KEY]: (c, e) => clone(c[CACHE_KEY])
				})
			}
		}
	);
};
