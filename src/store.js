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
export function useMachine(machine, context) {
	const service = interpret(
		machine.withContext({ ...machine.context, ...context })
	);
	const store = readable(machine.initialState, set => {
		service.onTransition(state => {
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

export function ItemStore(item) {
	return useMachine(itemMachine, { item });
}

const collectionMachine = Machine(
	{
		id: 'collection',
		strict: true,
		initial: 'noneSelected',
		context: {
			items: new Map(),
			selected: new Set()
		},
		on: {
			add: {
				// No target. Internal transition.
				internal: true,
				actions: ['doAdd', (c, e) => console.log(c.items)]
			}
		},
		states: {
			noneSelected: {
				on: {
					select: {
						target: 'someSelected',
						actions: 'doSelect'
					}
				}
			},
			// Action order: exit, transition, entry
			someSelected: {
				on: {
					deselect: [
						{
							target: 'noneSelected',
							cond: (c, e) => true,
							actions: ['doDeselect']
						},
						{ target: 'someSelected', actions: [] }
					]
				}
			}
		}
	},
	{
		actions: {
			doAdd: assign({
				items: (c, e) => {
					const id = String(new Date().valueOf());
					return c.items.set(id, ItemStore({ id, name: `Me: ${id}` }));
				}
			}),
			doSelect: assign({
				selected: (c, e) => c.selected.add(e.item.id)
			}),
			doDeselect: assign({
				selected: (c, e) => c.selected.delete(e.item.id)
			})
		}
	}
);

// For XState visualizer

Map.prototype.toJSON = function() {
	return Array.from(this.entries()).map(entry => `${entry[0]}: ${entry[1]}`);
};

Set.prototype.toJSON = function() {
	return Array.from(this);
};

let counter = 0;
function ItemStore(item) {
	return {
		id: new Date().valueOf(),
		name: `Item ${++counter}`
	};
}

export function CollectionStore(items = []) {
	return useMachine(collectionMachine, { items });
}
