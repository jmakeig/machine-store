<script>
	import { tick } from 'svelte';
	import { useMachine } from './store.js';
	import { machine } from './PropertyMachine.js';
	import camelcase from 'camelcase';

	export let value;
	export let level;
	export let index;

	let labelEl;

	const { status, property, dispatch } = useMachine(
		machine,
		{ property: value },
		{
			actions: {
				focusInput: () => tick().then(() => labelEl.select())
			}
		}
	);

	function inputDefaults(element) {
		element.autocomplete = 'off';
		element.autocorrect = 'off';
		element.autocapitalize = 'off';
		element.spellcheck = false;
	}

	function focus(element) {
		function handleLeave(event) {
			// console.log('blur', event.currentTarget, event.relatedTarget);
			if (!element.contains(event.relatedTarget)) {
				// console.log(event.relatedTarget);
				dispatch('blur');
			} else {
				event.preventDefault();
				event.stopPropagation();
			}
		}
		function handleArrive(event) {
			// console.log('focus', event.currentTarget, event.relatedTarget);
			dispatch('focus');
		}
		function handleKeyboard(event) {
			if (element.contains(document.activeElement)) {
				if ('Escape' === event.key) {
					if (document.activeElement) {
						document.activeElement.blur(); // I’m not sure why this works
					} else {
						element.blur();
					}
				}
			}
		}
		element.addEventListener('focus', handleArrive);
		element.addEventListener('focusout', handleLeave, { capture: true });
		element.addEventListener('keyup', handleKeyboard);

		return {
			// update(params) {},
			destroy() {
				element.removeEventListener('focus', dispatch);
				element.removeEventListener('focusout', handleBlur, { capture: true });
				element.addEventListener('keyup', handleKeyboard);
			}
		};
	}
</script>

<style>
	tr.property[data-type] .label span:before {
		display: inline-block;

		width: 1.5em;
		height: 1.5em;
		margin-right: 0.75em;
		padding: 0.25em;

		border-radius: 50%;

		font-size: 65%;
		line-height: 1;
		text-align: center;
		vertical-align: middle;
	}

	tr.property[data-type='string'] .label span:before {
		color: #fff;

		content: 'S';

		background: green;
	}
	tr.property[data-type='date'] .label span:before {
		color: #fff;

		content: 'D';

		background: #333;
	}
	tr.property[data-type='number'] .label span:before {
		color: #fff;

		content: 'N';

		background: #333;
	}
	tr.property[data-type='boolean'] .label span:before {
		color: #fff;

		content: 'B';

		background: #333;
	}
	tr.property[data-type='object'] .label span:before {
		color: #fff;

		content: 'O';

		background: purple;
	}
	tr.property[data-type='entity'] .label span:before {
		color: #fff;

		content: 'E';

		background: orange;
	}
	td.select,
	td.cardinality {
		text-align: center;
	}
	td.name span {
		font-family: var(--monospace);
	}
	tr.property:focus,
	tr.property:focus-within {
		outline: inherit;
		outline-offset: -4px;
	}
	.numeric {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	tr.property:focus-within {
		outline-color: Highlight;
		outline-style: solid;
		outline-width: 4px;
		border-radius: 4px;
		/* transition: all 0.3s; */
	}

	/* WebKit gets its native focus styles. */
	@media (-webkit-min-device-pixel-ratio: 0) {
		tr.property:focus-within {
			outline-color: -webkit-focus-ring-color;
			outline-style: auto;
		}
	}
	input[type='text']:read-only {
		background: transparent;
		border-color: orange;
	}
</style>

<tr
	class="property"
	data-type={$property.type}
	data-level={level}
	tabindex="0"
	use:focus>
	<td class="index numeric">{index}</td>
	<td class="select">
		<input type="checkbox" />
	</td>
	<th class="label" scope="row">
		<span style="margin-left: {level * 1.5}em;">
			{#if $status.matches('editing')}
				<input
					type="text"
					bind:value={$property.label}
					tabindex="0"
					bind:this={labelEl}
					on:input={event => ($property.name = camelcase($property.label))}
					use:inputDefaults />
			{:else}{$property.label}{/if}
		</span>
	</th>
	<td class="name">
		<span style="margin-left: {level * 1.5}em;">
			{#if $status.matches('editing')}
				<input
					type="text"
					bind:value={$property.name}
					tabindex="0"
					use:inputDefaults />
			{:else}
				<span>{$property.name}</span>
			{/if}
		</span>
	</td>
	<td class="type">
		{#if $status.matches('editing')}
			<select tabindex="0" bind:value={$property.type}>
				<option value="string">String</option>
				<option value="number">Number</option>
				<option value="date">Date</option>
				<option value="boolean">Boolean</option>
				<option value="object">Object</option>
				<option value="entity">Entity</option>
			</select>
		{:else}{$property.type}{/if}
	</td>
	<td class="cardinality">
		<input type="checkbox" />
	</td>
	<td class="actions">
		<button
			title="Delete {$property.label}"
			on:click={event => dispatch('delete', $property.id)}>
			Delete
		</button>
		<button
			title="Add new property after {$property.label}"
			on:click={event => dispatch('add', $property.id)}>
			Add
		</button>
		<span>{$status.toStrings().pop()}</span>
	</td>
</tr>
