<script lang="ts">
	import DeDeVolonte from "./DeDeVolonte.svelte"

	export let buttonType: "buy" | "sell" | "use"
	export let disabled: boolean
	export let itemPrice = 0
	export let canUse = true
	export let small = false
	export let disabledMessage = ""
	export let onClick: () => void
</script>

<div class="wrapper">
	<button
		class:small
		class:tooltip="{disabled}"
		class="{buttonType}-button"
		disabled="{disabled}"
		on:click="{onClick}">
		{#if disabled}
			<span
				class="{buttonType === 'buy' ? 'bottom-16' : 'bottom-12'} tooltiptext"
				>{disabledMessage}</span>
		{/if}
		<span class="text-xl mb-1.5 font-black">
			{#if ["buy", "sell"].includes(buttonType)}
				{itemPrice}
				<DeDeVolonte className="pb-0.5 hover-ddv" />
			{:else if buttonType === "use"}
				{#if canUse}
					Utiliser
				{:else}
					<slot>Inutilisable</slot>
				{/if}
			{/if}
		</span>
	</button>
</div>

<style lang="postcss">
	.wrapper {
		@apply flex flex-initial content-center justify-around justify-items-center items-center text-center;
	}

	button {
		width: 10.5rem;
		height: 3.7rem;
		@apply bg-cover bg-center flex flex-initial items-center justify-center;
	}

	button:hover:not(:disabled) {
		@apply brightness-75;
	}

	button:active:not(:disabled) {
		@apply brightness-125;
	}

	button:disabled {
		/* disabledButton.png is 316x111 (this / 3 = 105x37) */
		background-image: url("img/buttons/generic/disabledButton.png");
		color: #34343c;
		cursor: not-allowed;
	}

	.buy-button,
	.use-button {
		/* greenButton.png is 316x111 (this / 3 = 105x37) */
		background-image: url("img/buttons/generic/greenButton.png");
		color: #045a39;
	}

	.sell-button {
		/* brownButton.png is 316x111 (this / 3 = 105x37) */
		background-image: url("img/buttons/generic/brownButton.png");
		color: #d7bd9f;
	}

	.small {
		width: 7.88rem;
		height: 2.78rem;
	}

	:global(button:hover .hover-ddv) {
		animation-duration: 1s;
	}

	.tooltip {
		position: relative;
		display: inline-block;
	}

	.tooltip .tooltiptext {
		@apply invisible items-center inline-flex left-0 p-1 bg-black bg-opacity-90 absolute z-10 rounded text-center text-white text-xs;
	}

	.tooltip:hover .tooltiptext {
		@apply visible;
	}
</style>
