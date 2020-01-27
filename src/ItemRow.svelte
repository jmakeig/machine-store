<script>
	import { useService } from './store.js';
	export let ref; // Service
	let { store, dispatch } = useService(ref);
</script>

<tr>
	<td>
		<input type="checkbox" />
	</td>
	<td>{$store.context.item.name}</td>
	<td>{$store.context.item.description}</td>
</tr>
