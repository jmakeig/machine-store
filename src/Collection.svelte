<script>
	import Item from './Item.svelte';

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

<div>
	<button on:click={event => dispatch('add', { item: newItemTemplate })}>
		Add…
	</button>
	{items.size}
</div>

{#each [...items.values()] as item (item.id)}
	<Item value={item} />
{/each}
