import { writable, readable } from 'svelte/store';
import { Machine, interpret } from 'xstate';

const machine = Machine({
	id: 'item',
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

export function ItemStore(item) {
	const service = interpret(machine.withContext({ ...machine.context, item }));
	const store = readable(machine.initialState, set => {
		service.onTransition(state => {
			if (state.changed) {
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

export function CollectionStore() {
	const store = writable([]);
	return {
		state: store,
		add(item) {
			store.update(items => [...items, ItemStore(item)]);
		}
	};
}
