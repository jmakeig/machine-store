<script>
	import { useMachine } from './store.js';
	import { itemsMachine as machine } from './machine.js';
	import ItemRow from './ItemRow.svelte';

	export let items;
	let { state, dispatch } = useMachine(machine, { items });
	$: items = $state.context.refs;
</script>

<style>

</style>

<!-- <div>
	<button on:click={event => dispatch('add', { item: newItemTemplate })}>
		Add
	</button>
	<button on:click={event => dispatch('delete')}>Delete…</button>
	{items.size}
</div> -->
{$state.value}
<table>
	<thead>
		<tr>
			<th>
				<input type="checkbox" />
				{items.size} items
			</th>
			<th>Name</th>
			<th>Description</th>
			<th>State</th>
			<th>Events</th>
		</tr>
	</thead>
	<tbody>
		{#each [...items.entries()] as [id, ref], i (id)}
			<ItemRow {ref} />
		{/each}
	</tbody>
</table>
