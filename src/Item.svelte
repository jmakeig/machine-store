<script>
	export let value;

	let { state, dispatch } = value;
</script>

<div>
	{#if $state.matches('unselected')}
		<button on:click={event => dispatch('select')}>Select</button>
	{:else if $state.matches('selected')}
		<button on:click={event => dispatch('blur')}>Blur</button>
	{/if}
</div>
<pre>{JSON.stringify($state, null, 2)}</pre>
