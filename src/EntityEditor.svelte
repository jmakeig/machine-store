<script>
	export let properties;

	function dispatch(event, data) {
		console.log(event, data);
	}

	function* traverse(tree, level = 0) {
		if (undefined === tree) return;
		for (const property of tree) {
			yield { property, level };
			yield* traverse(item.properties, level + 1);
		}
	}
</script>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 0.5em;
		text-align: left;
		border-bottom: solid 0.5px #ccc;
	}
	tbody th {
		font: inherit;
	}
</style>

<table>
	<thead>
		<tr>
			<th scope="col" />
			<th scope="col">
				<!--Type icon-->
			</th>
			<th scope="col">Label</th>
			<th scope="col">Name</th>
			<th scope="col">Type</th>
			<th scope="col">Cardinality</th>
			<th scope="col" />
		</tr>
	</thead>
	<tbody>
		{#each Array.from(traverse(properties)) as { property, level }}
			<tr>
				<td>
					<input type="checkbox" />
				</td>
				<td>{level}</td>
				<th scope="row">
					<span style="margin-left: {level * 1.25}em;">{property.label}</span>
				</th>
				<td>{property.name}</td>
				<td>{property.type}</td>
				<td>
					<input type="checkbox" />
				</td>
				<td>
					<button
						title="Delete this property"
						on:click={event => dispatch('delete', property.id)}>
						Delete
					</button>
					<button title="Add new property below">Add</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
