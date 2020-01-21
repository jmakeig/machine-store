<script>
	export let value; // {store, dispatch}

	let { store, dispatch } = value;
	$: state = $store; // XState.State
	$: ({ item } = state.context); // any
</script>

<tr>
	<td>
		<input type="checkbox" />
	</td>
	<td>{item.name}</td>
	<td>{item.description}</td>
</tr>
