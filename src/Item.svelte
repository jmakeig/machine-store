<script>
	export let value;

	let { state, dispatch } = value;
</script>

<style>
	section {
		padding: 0.5em;
		border: solid 0.5px #ccc;
		margin: 1em 0;
	}
</style>

<section>
	<div>
		{#if $state.matches('unselected')}
			<button on:click={event => dispatch('select')}>Select</button>
		{:else if $state.matches('selected')}
			<button on:click={event => dispatch('blur')}>Blur</button>
		{/if}
	</div>
	<pre>{JSON.stringify($state, null, 2)}</pre>
</section>
