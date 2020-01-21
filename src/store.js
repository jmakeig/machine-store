import { readable } from 'svelte/store';
import { Machine, interpret, assign } from 'xstate';

const itemMachine = Machine({
	id: 'item',
	strict: true,
	initial: 'unselected',
	context: {
		item: null
	},
	states: {
		unselected: {
			on: {
				select: 'selected'
			}
		},
		selected: {
			on: {
				blur: 'unselected'
			}
		}
	}
});

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
			if (undefined === state.changed || true === state.changed) {
				set(state);
			}
		});
		service.start();
		return () => service.stop();
	});
	return {
		store,
		dispatch: service.send
	};
}

export function CollectionStore(items = new Map()) {
	return useMachine(collectionMachine, { items });
}
export function ItemStore(item) {
	return useMachine(itemMachine, { item });
}

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
