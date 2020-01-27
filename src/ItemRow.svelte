<script>
	import { useService } from './store.js';
	export let ref; // Service > Interpreter
	let { store, dispatch } = useService(ref);
	$: state = $store;
	$: ({ item } = state.context);
</script>

<tr>
	<td>
		<input type="checkbox" />
	</td>
	<td>{state.context.item.name}</td>
	<td>{state.context.item.description}</td>
	<td>{JSON.stringify($store.value)}</td>
	<td>
		<button on:click={event => dispatch('edit')}>Edit</button>
		<button
			on:click={event => dispatch('change', {
					item: {
						id: 'ASDF',
						name: 'ASDF',
						description: 'DESCRIPTION'
					}
				})}>
			Change
		</button>
	</td>
</tr>
