<script>
	//import Collection from './Collection.svelte';
	import Item from './Item.svelte';
	import { ItemStore } from './store.js';

	const item = {
		id: 123,
		name: `First item`
	};
</script>

<Item value={ItemStore(item)} />
