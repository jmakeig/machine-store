<script>
	import { useService } from './store.js';
	export let ref; // Service > Interpreter
	let { state, dispatch } = useService(ref);
	$: ({ item } = $state.context);
</script>

<tr>
	<td>
		<input type="checkbox" />
	</td>
	<td>{item.name}</td>
	<td>{item.description}</td>
	<td>{JSON.stringify($state.value)}</td>
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
