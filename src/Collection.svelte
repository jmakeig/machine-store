<script>
	import { useMachine } from './store.js';
	import { itemsMachine as machine } from './machine.js';
	import ItemRow from './ItemRow.svelte';

	export let items;
	let { store, dispatch } = useMachine(machine, { items });
	$: state = $store; // XState.State
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

<table>
	<thead>
		<tr>
			<th>
				<input type="checkbox" />
			</th>
			<th>Name</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		{#each [...state.context.refs.entries()] as [id, ref], i (id)}
			<ItemRow {ref} />
		{/each}
	</tbody>
</table>
