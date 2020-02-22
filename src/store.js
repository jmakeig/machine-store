import { readable, derived } from 'svelte/store';
import { interpret } from 'xstate';

const defaultEventCreator = () => ({ type: 'change' });

export function useMachine(
	machine,
	initialContext = {},
	additionalConfig = {},
	eventCreator = defaultEventCreator
) {
	const keys = Object.keys(initialContext);
	if (1 !== keys.length && process.env.NODE_ENV !== 'production') {
		console.warn('Expected 1 key in initialContext', keys);
	}
	const key = Object.keys(initialContext)[0] || 'item';
	if (0 === keys.length && process.env.NODE_ENV !== 'production') {
		console.warn(`Defaulting to ${key} for context key name`);
	}
	if ('function' === typeof machine) {
		machine = machine(key);
	}

	const service = interpret(
		machine
			.withConfig(additionalConfig)
			.withContext({ ...machine.context, ...initialContext })
	);

	const status = readable(machine.initialState, set => {
		service.onTransition(state => {
			if (false !== state.changed) {
				set(state);
			}
		});
		service.start();
		return () => service.stop();
	});

	const context = derived(status, $status => $status.context[key]);

	return {
		dispatch: service.send,
		status,
		[key]: {
			subscribe: context.subscribe,
			set: value => service.send({ ...eventCreator(), [key]: value })
		}
	};
}
