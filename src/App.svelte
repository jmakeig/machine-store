<script>
	//import Collection from './Collection.svelte';
	import Item from './Item.svelte';
	import { CollectionStore } from './store.js';

	const item = {
		id: 123,
		name: `First item`
	};

	let { state, add } = CollectionStore();
</script>

<div>
	<button on:click={event => add(item)}>Add…</button>
	{$state.length}
</div>

{#each $state as item}
	<Item value={item} />
{/each}
