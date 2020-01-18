<script>
	import Item from './Item.svelte';

	export let items;
	let { state, add } = items;

	const item = {
		id: 123,
		name: `First item`
	};
</script>

<div>
	<button on:click={event => add(item)}>Add…</button>
	{$state.length}
</div>

{#each $state as item}
	<Item value={item} />
{/each}
