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
	return useMachine(itemMachine, { item }, c => c.item);
}

const collectionMachine = Machine(
	{
		id: 'collection',
		strict: true,
		initial: 'idle',
		context: {
			items: []
		},
		states: {
			idle: {
				on: {
					add: {
						target: 'idle',
						actions: 'doAdd'
					}
				}
			}
		}
	},
	{
		actions: {
			doAdd: assign({
				items: (c, e) => [ItemStore(e.item), ...c.items]
			})
		}
	}
);

export function CollectionStore(items = []) {
	return useMachine(collectionMachine, { items });
}
