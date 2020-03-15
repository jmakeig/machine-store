<script>
	import { useMachine } from './store.js';
	import { machine } from './EntityMachine.js';
	import PropertyEditor from './PropertyEditor.svelte';

	// import { readable } from 'svelte/store';

	export let definition;

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
			const context = property.state.context.property;
			yield { property, ancestors };
			yield* flatten(context.properties, [...ancestors, context.name]);
		}
	}

	function handleRowClick(event) {
		console.log(this);
	}

	const { status, entity, dispatch } = useMachine(machine, {
		entity: definition
	});

	// const entity = readable(definition);
	// const status = readable(true);
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
<h1>{$entity.label} ({$status.toStrings().join('.')})</h1>

{#if $status}
	<article class="table">
		<table>
			<thead>
				<tr>
					<!-- <th scope="col" class="index">&nbsp;</th> -->
					<th scope="col" class="select">
						<input type="checkbox" />
					</th>
					<th scope="col" class="label">Label</th>
					<th scope="col" class="name">Name</th>
					<th scope="col" class="type">Type</th>
					<th scope="col" class="cardinality" title="Cardinality">Many?</th>
					<th scope="col" class="actions">&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				{#each Array.from(flatten($entity.properties)) as { property, ancestors }, index}
					<PropertyEditor ref={property} level={ancestors.length} {index} />
				{:else}
					<p>Nope!</p>
				{/each}
			</tbody>
		</table>
	</article>
{/if}
