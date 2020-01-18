<script>
	import Collection from './Collection.svelte';
	import { CollectionStore } from './store.js';

	let items = CollectionStore([]);
</script>

<Collection {items} />
