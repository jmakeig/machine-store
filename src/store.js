import { writable, readable } from 'svelte/store';
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
function useMachine(machine, context, selector = c => c) {
	// console.log(machine.context, context, { ...machine.context, ...context });
	const service = interpret(
		machine.withContext({ ...machine.context, ...context })
	);
	const store = readable(machine.initialState, set => {
		service.onTransition(state => {
			console.log('trans', state);
			if (undefined === state.changed || true === state.changed) {
				set({ state, context: selector(state.context) });
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
				items: (c, e) => [...c.items, ItemStore(e.item)]
			})
		}
	}
);

export function CollectionStore(items = []) {
	return useMachine(collectionMachine, { items }, c => c.items);
}
