import { readable, derived } from 'svelte/store';
import { interpret } from 'xstate';

const defaultEventCreator = () => ({ type: 'change' });

// FIXME: This implementation is incomplete
export function useService(service) {
	const status = readable(service.initialState, set => {
		service.onTransition(state => {
			if (false !== state.changed) {
				set(state);
			}
		});
		service.start();
		return () => service.stop();
	});
	const key = 'property'; // FIXME
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

/**
 *
 * @param {StateMachine|function} machine a machine instance or a function that, given a key parameter, creates a machine
 * @param {*} initialContext a single-property object whose property name determines the primary context key, defaults to `'item'` and warns when not in a production environment
 * @param {*} additionalConfig additional config sent to `.withConfig()`
 * @param {*} [eventCreator = () => ({ type: 'change' })] a function that creates the event that’s fired with the `context[key]` is updated
 */
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
