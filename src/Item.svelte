<script>
	export let value; // {store, dispatch}

	let { store, dispatch } = value;
	$: state = $store; // XState.State
	$: ({ item } = state.context); // any
</script>

<style>
	section {
		padding: 0.5em;
		margin: 1em 0;
	}
	section > section {
		display: flex;
		padding: 1em;
		border: none;
	}
	section > section > * {
		flex-grow: 1;
		flex-basis: 0;
		border: none;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 0.5em;
		text-align: left;
	}
	th {
		background-color: #eee;
	}
	section,
	table,
	th,
	td {
		border: solid 0.5px #ccc;
	}
</style>

<section>
	<div>
		{#if state.matches('unselected')}
			<button on:click={event => dispatch('select')}>Select</button>
		{:else if state.matches('selected')}
			<button on:click={event => dispatch('blur')}>Blur</button>
		{/if}
	</div>
	<section>
		<pre>{JSON.stringify(state, null, 2)}</pre>
		<div>
			<!-- <pre>{JSON.stringify(context, null, 2)}</pre> -->
			<table>
				<tr>
					<th>ID</th>
					<td>{item.id}</td>
				</tr>
				<tr>
					<th>Name</th>
					<td>{item.name}</td>
				</tr>
			</table>
		</div>
	</section>
</section>
