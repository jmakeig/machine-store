<script>
	import Item from './Item.svelte';

	export let value;
	let { store, dispatch } = value;

	$: state = $store;
	$: ({ items } = state.context);

	// This feels kinda yucky

	const item = {
		id: 123,
		name: `First item`
	};
</script>

<div>
	<button on:click={event => dispatch('add', { item })}>Add…</button>
	{items.size}
</div>

{#each [...items.values()] as item (item.id)}
	<Item value={item} />
{/each}
