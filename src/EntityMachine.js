import { Machine, assign, spawn } from 'xstate';
import { clone } from './util.js';
import { machine as propertyMachine } from './PropertyMachine.js';

export const machine = Machine({
	id: 'entity',
	strict: true,
	context: { entity: null },
	initial: 'initializing',
	states: {
		initializing: {
			entity: assign({
				refs: ({ entity }) => {
					return entity.properties.map(property =>
						spawn(propertyMachine().withContext({ property }))
					);
				}
			}),
			on: {
				'': { target: 'unselected' }
			}
		},
		unselected: {}
	}
});
