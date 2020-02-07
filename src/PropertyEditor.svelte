<script>
	import { Machine, assign } from 'xstate';
	import { useMachine } from './store.js';

	export let value;
	export let level;

	const machine = Machine({
		id: 'property',
		strict: true,
		context: {
			property: null,
			cache: null
		},
		initial: 'viewing',
		on: {
			delete: {}
		},
		states: {
			viewing: {
				on: {
					edit: {
						target: 'editing'
						// actions: 'focusInput'
					}
				}
			},
			editing: {
				onEntry: assign({
					cache: (c, e) => ({ ...c.item })
				}),
				on: {
					change: {
						actions: [
							assign({
								item: (c, e) => e.item
							})
						]
					},
					cancel: {
						target: 'viewing',
						actions: assign({
							item: (c, e) => ({ ...c.cache })
						})
					}
				}
			}
		}
	});

	let { state, dispatch } = useMachine(machine, { property: value });
	$: ({ property } = $state.context); // any
</script>

<style>
	tr.property[data-type] .label span:before {
		display: inline-block;

		width: 1.5em;
		height: 1.5em;
		margin-right: 0.75em;
		padding: 0.25em;

		border-radius: 50%;

		font-size: 65%;
		line-height: 1;
		text-align: center;
		vertical-align: middle;
	}

	tr.property[data-type='string'] .label span:before {
		color: #fff;

		content: 'S';

		background: green;
	}
	tr.property[data-type='object'] .label span:before {
		color: #fff;

		content: 'O';

		background: purple;
	}
	td.select,
	td.cardinality {
		text-align: center;
	}
	td.name span {
		font-family: var(--monospace);
	}
	/*
	tr.property[data-level] .label,
	tr.property[data-level] .name {
		--level: 0;
		padding-left: calc(1.5em * var(--level) + 0.5em);
	}
	tr.property[data-level='1'] .label,
	tr.property[data-level='1'] .name {
		--level: 1;
	}
	*/
</style>

<tr class="property" data-type={property.type} data-level={level}>
	<td class="select">
		<input type="checkbox" />
	</td>
	<th class="label" scope="row">
		<span style="margin-left: {level * 1.25}em;">{property.label}</span>
	</th>
	<td class="name">
		<span style="margin-left: {level * 1.25}em;">{property.name}</span>
	</td>
	<td class="type">{property.type}</td>
	<td class="cardinality">
		<input type="checkbox" />
	</td>
	<td class="actions">
		<button
			title="Edit {property.label}"
			on:click={event => dispatch('edit', property.id)}>
			Edit
		</button>
		<button
			title="Delete {property.label}"
			on:click={event => dispatch('delete', property.id)}>
			Delete
		</button>
		<button
			title="Add new property after {property.label}"
			on:click={event => dispatch('add', property.id)}>
			Add
		</button>
	</td>
</tr>
