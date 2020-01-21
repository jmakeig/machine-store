<script>
	import ItemRow from './ItemRow.svelte';

	export let value;
	let { store, dispatch } = value;

	$: state = $store;
	$: ({ items } = state.context);

	// This feels kinda yucky

	const newItemTemplate = {
		id: null,
		name: null
	};
</script>

<style>
	
</style>

<div>
	<button on:click={event => dispatch('add', { item: newItemTemplate })}>
		Add
	</button>
	<button on:click={event => dispatch('delete')}>Delete…</button>
	{items.size}
</div>

<table>
	<thead>
		<tr>
			<th>
				<input type="checkbox" />
			</th>
			<th>Name</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		{#each [...items.values()] as item, i (item.id)}
			<!-- <pre>{Object.keys(item).join(', ')}</pre> -->
			<ItemRow value={item} />
		{/each}
	</tbody>
</table>
