import { Machine, assign, spawn } from 'xstate';
import { machine as propertyMachine } from './PropertyMachine.js';

/**
 * Depth-first copy with selective transformation.
 * For each of the `Iterable` selected by the selector function, it
 * applies the `visitor` function and continues recursively.
 *
 *
 * @param {object} node the tree structure
 * @param {function} [visitor] the function to apply to selected children
 * @param {function} [childrenSelector] selects an `Iterable` of children
 * @return {object} the new tree
 */
function transform(object, visitor = v => v, childrenSelector = p => true) {
	const copy = Object.create(Object.getPrototypeOf(object));

	for (let p in object) {
		if (!childrenSelector(p)) {
			copy[p] = object[p];
		} else {
			copy[p] = object[p].map(prop =>
				visitor(transform(prop, visitor, childrenSelector))
			);
		}
	}
	return copy;
}

export const machine = key =>
	Machine({
		id: key,
		strict: true,
		context: { [key]: { properties: [] } }, // FIXME: Why do I have to creaet a dummy context?
		initial: 'initializing',
		states: {
			initializing: {
				entry: assign({
					[key]: (c, e) =>
						transform(
							c[key],
							property => {
								// console.log(property);
								return spawn(
									propertyMachine('property').withContext({ property }),
									property.id
								);
							},
							p => 'properties' === p
						)
				}),
				on: {
					'': { target: 'unselected' }
				}
			},
			unselected: {
				on: {
					select: { target: 'selected' }
				}
			},
			selected: {}
		}
	});
