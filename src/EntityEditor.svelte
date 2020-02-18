<script>
	import PropertyEditor from './PropertyEditor.svelte';
	export let properties;

	function dispatch(event, data) {
		console.log(event, data);
	}

	/**
	 * Flattens a hierarchical tree into a flat iterable, tracking levels
	 * of each item via its `ancestors` `Array`. Traverses depth first.
	 *
	 * @param tree
	 * @param ancestors
	 */
	function* flatten(tree, ancestors = []) {
		if (undefined === tree) return;
		for (const property of tree) {
			yield { property, ancestors };
			yield* flatten(property.properties, [...ancestors, property.name]);
		}
	}

	function handleRowClick(event) {
		console.log(this);
	}
</script>

<style>
	thead .index {
		width: 2em;
	}
	thead .select,
	thead .cardinality {
		width: 4em;
		text-align: center;
	}
	thead .type {
		width: 16em;
	}
	thead .actions {
		width: 12em;
	}
</style>

<svelte:head>
	<link rel="stylesheet" href="/table.css" />
</svelte:head>

<table>
	<thead>
		<tr>
			<th scope="col" class="index">&nbsp;</th>
			<th scope="col" class="select">
				<input type="checkbox" />
			</th>
			<th scope="col" class="label">Label</th>
			<th scope="col" class="name">Name</th>
			<th scope="col" class="type">Type</th>
			<th scope="col" class="cardinality" title="Cardinality">[ ]</th>
			<th scope="col" class="actions">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
		{#each Array.from(flatten(properties)) as { property, ancestors }, index}
			<PropertyEditor value={property} level={ancestors.length} {index} />
		{:else}
			<p>Nope!</p>
		{/each}
	</tbody>
</table>
