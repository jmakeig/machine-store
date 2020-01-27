import { Machine, assign, spawn } from 'xstate';

const log = (c, e) => console.log(e, c);

export const itemMachine = Machine({
	id: 'item',
	strict: true,
	context: {
		item: null,
		cache: null
	},
	initial: 'viewing',
	on: {
		delete: {}
	},
	states: {
		viewing: {
			on: {
				edit: {
					target: 'editing'
					// actions: 'focusInput'
				}
			}
		},
		editing: {
			onEntry: assign({
				cache: (c, e) => ({ ...c.item })
			}),
			on: {
				change: {
					actions: [
						log,
						assign({
							item: (c, e) => e.item
						})
					]
				},
				cancel: {
					target: 'viewing',
					actions: assign({
						item: (c, e) => ({ ...c.cache })
					})
				}
			}
		}
	}
});

export const itemsMachine = Machine({
	id: 'items',
	strict: true,
	context: {
		items: [], // Item dictionaries
		refs: new Map() // [id: string, Machine]
	},
	initial: 'initializing',
	states: {
		initializing: {
			entry: assign({
				refs: ({ items }, e) => {
					// Map all of the initial items into itemMachine instances
					// that manage their own state
					const refs = new Map();
					for (const item of items) {
						refs.set(item.id, spawn(itemMachine.withContext({ item })));
					}
					return refs;
				}
			}),
			on: {
				'': 'all'
			}
		},
		all: {}
	}
});

// .withContext({
// 	items: [
// 		{ id: '1', name: 'Uno' },
// 		{ id: '2', name: 'Dos' }
// 	]
// });

// const service = interpret(itemsMachine).onTransition(state => {
// 	console.log(state.context);
// });
// service.start();

/*
Map.prototype.toJSON = function() {
	return Array.from(this.entries()).map(entry => `${entry[0]}: ${entry[1]}`);
};

Set.prototype.toJSON = function() {
	return Array.from(this);
};
*/
