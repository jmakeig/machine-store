import { Machine, assign, spawn } from 'xstate';
import { machine as propertyMachine } from './PropertyMachine.js';

/*
console.log(
	propertyMachine('property').withContext({ property: { name: 'asdf' } })
);
*/

export const machine = key =>
	Machine({
		id: key,
		strict: true,
		context: { [key]: { properties: [] } }, //
		initial: 'initializing',
		states: {
			initializing: {
				entry: assign({
					[key]: (c, e) => ({
						...console.log(c),
						...c[key],
						properties: c[key].properties.map(property =>
							spawn(propertyMachine('property').withContext({ property }))
						)
					})
				}),
				// entry: assign({
				// 	[key]: (c, e) => ({ ...console.log(c), ...c[key] })
				// }),
				on: {
					'': { target: 'unselected' }
				}
			},
			unselected: {}
		}
	});
