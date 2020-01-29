import { readable } from 'svelte/store';
import { Machine, interpret, assign } from 'xstate';

/*
// https://github.com/davidkpiano/xstate/issues/423
const coreItemMachine = {
	initial: 'unselected',
	states: {
		unselected: {
			on: {
				select: {
					target: 'selected'
				}
			}
		},
		selected: {
			on: {
				blur: {
					target: 'unselected'
				}
			},
			initial: 'viewing',
			states: {
				viewing: {
					on: {
						edit: {
							target: 'editing'
						}
					}
				},
				editing: {
					initial: 'clean',
					states: {
						clean: {
							on: {
								change: {
									target: 'dirty'
								}
							}
						},
						dirty: {
							on: {
								change: {},
								cancel: {
									target: 'clean'
								},
								save: {}
							},
							states: {
								saving: {
									on: {
										error: {},
										done: {
											target: '#item.persisted.selected.editing.clean'
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};

const itemMachine = Machine({
	id: 'item',
	strict: true,
	context: {
		item: null
	},
	initial: 'persisted',
	states: {
		persisted: coreItemMachine,
		new: coreItemMachine,
		deleted: {}
	}
});
*/

/**
 *
 * @param {Machine} machine XState machine
 * @param {*} context Shallow merged with initial machine context
 * @returns `{ store, dispatch }`
 */
export function useMachine(machine, context = {}) {
	// console.log({ ...machine.context, ...context });
	const service = interpret(
		machine.withContext({ ...machine.context, ...context })
	);
	const store = readable(machine.initialState, set => {
		service.onTransition(state => {
			// console.log(state);
			if (false !== state.changed) {
				set(state);
			}
		});
		service.start();
		return () => service.stop();
	});
	return {
		state: store,
		dispatch: service.send
	};
}

/**
 * Subscribe to an existing service. There’s not affordance for
 * setting the initial context becuase it’s assumed that the parent
 * service does that. For exmaple,
 *
 *    spawn(childMachine.withContext({ … }))
 *
 * @param {Machine} service
 */
export function useService(service) {
	const store = readable(service.state || service.initialState, set => {
		const { unsubscribe } = service.onTransition(state => {
			if (state.changed !== false) {
				set(state);
			}
		});
		return unsubscribe;
	});
	return {
		state: store,
		dispatch: service.send
	};
}
/*
export function CollectionStore(items = new Map()) {
	return useMachine(collectionMachine, { items });
}
export function ItemStore(item) {
	return useMachine(itemMachine, { item });
}
*/

/**************************************************************/
/* XState visualizer
const initItems = new Map();
// initItems.set('1', ItemStore({ id: '1', name: `Item ${1}` }));
// initItems.set('2', ItemStore({ id: '2', name: `Item ${2}` }));

const initSelected = new Set();
// initSelected.add('2');
// initSelected.add('1');

// const initState = 'someSelected';
const initState = 'noneSelected';
*/

const add = {
	add: {
		cond: ({ items }, event) => !items.has(null),
		actions: 'doAdd'
	}
};

const collectionMachine = Machine(
	{
		id: 'collection',
		strict: true,
		initial: 'noneSelected', //initState,
		context: {
			items: new Map(), // initItems
			selected: new Set() // initSelected
		},
		states: {
			noneSelected: {
				on: {
					select: {
						cond: ({ items }, e) => items.size > 0,
						target: 'someSelected',
						actions: 'doSelect'
					},
					...add
				}
			},
			// Action order: exit, transition, entry
			someSelected: {
				on: {
					select: [
						{
							cond: ({ items }, { item }) => item && items.has(item.id),
							target: 'someSelected',
							actions: 'doSelect'
						},
						{
							target: 'error'
						}
					],
					deselect: [
						{
							cond: ({ selected }, { item }) =>
								selected.size === 1 && selected.has(item.id),
							target: 'noneSelected',
							actions: ['doDeselect']
						},
						{ target: 'someSelected', actions: ['doDeselect'] }
					],
					...add
				}
			},
			error: {}
		}
	},
	{
		actions: {
			doAdd: assign({
				items: ({ items }, { item }) => {
					// const id = String(new Date().valueOf());
					return items.set(item.id, ItemStore(item));
				}
			}),
			doSelect: assign({
				selected: ({ selected }, { item }) => selected.add(item.id)
			}),
			doDeselect: assign({
				selected: ({ selected }, { item }) => {
					if (!selected.delete(item.id)) {
						throw new Error(item.id);
					}
					return selected;
				}
			})
		}
	}
);

/* XState visualizer

Map.prototype.toJSON = function() {
	return Array.from(this.entries()).map(entry => `${entry[0]}: ${entry[1]}`);
};

Set.prototype.toJSON = function() {
	return Array.from(this);
};

let counter = 0;
function ItemStore(item) {
	return {
		store: item
	};
}
*/

/* Events

{
	"type": "add",
	"item": {
		"id": "1"
	}
}

{
	"type": "add",
	"item": {
		"id": "2"
	}
}

{
	"type": "select",
	"item": {
		"id": "1"
	}
}


{
	"type": "deselect",
	"item": {
		"id": "1"
	}
}

*/
