<script>
	import Collection from './Collection.svelte';
	import { CollectionStore } from './store.js';

	let items = CollectionStore();
</script>

<Collection value={items} />

<svelte:window on:error={event => alert(event.message)} />
