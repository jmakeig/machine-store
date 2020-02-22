<script>
	// import Collection from './Collection.svelte';
	// import { CollectionStore } from './store.js';
	import EntityEditor from './EntityEditor.svelte';

	const Cardinality = Object.freeze({
		one: 1,
		many: Infinity
	});

	const entity = {
		label: 'Customer',
		name: 'customer',
		properties: [
			{
				label: 'Given Name',
				name: 'givenName',
				type: 'string',
				cardinality: Cardinality.one
			},
			{
				label: 'Family Name',
				name: 'familyName',
				type: 'string',
				cardinality: Cardinality.one
			},
			{
				label: 'Shipping Address',
				name: 'shippingAddress',
				type: 'object',
				cardinality: Cardinality.one,
				properties: [
					{
						label: 'Street Address',
						name: 'address',
						type: 'string',
						cardinality: Cardinality.one
					},
					{
						label: 'City',
						name: 'city',
						type: 'string',
						cardinality: Cardinality.one
					},
					{
						label: 'State',
						name: 'state',
						type: 'string',
						cardinality: Cardinality.one
					},
					{
						label: 'ZIP Code',
						name: 'zip',
						type: 'string',
						cardinality: Cardinality.one
					}
				]
			}
		]
	};
</script>

<EntityEditor definition={entity} />

<svelte:window on:error={event => alert(event.message)} />
