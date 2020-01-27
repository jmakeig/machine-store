<script>
	import Collection from './Collection.svelte';
	// import { CollectionStore } from './store.js';

	let items = [{ id: '1', name: 'Uno' }, { id: '2', name: 'Dos' }];
</script>

<Collection {items} />

<svelte:window on:error={event => alert(event.message)} />
