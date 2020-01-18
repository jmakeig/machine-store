<script>
	import Item from './Item.svelte';

	export let items;
	let { store, dispatch } = items;

	// This feels kinda yucky
	$: ({ state, items: collection } = $store);

	const item = {
		id: 123,
		name: `First item`
	};
</script>

<div>
	<button on:click={event => dispatch('add', { item })}>Add…</button>
	{collection.length}
</div>

{#each collection as item}
	<Item value={item} />
{/each}
