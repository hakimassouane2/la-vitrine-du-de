<script lang="ts">
	export let label: string
	export let icon: string
	export let onClick: () => void
	export let active: boolean
</script>

<button
	class:active
	class:brightness-75="{!active}"
	class="side-button"
	on:click="{onClick}">
	<img src="{icon}" alt="{label}" />

	<span>{label}</span>
</button>

<style lang="postcss">
	.side-button {
		/* buttonBackground.png is 164x128 (this / 1.5 = 109x85) */
		background-image: url("img/buttons/buttonBackground.png");
		width: 10.9rem;
		height: 8.5rem;
		@apply bg-cover bg-center flex-initial transition duration-200 ease-in-out transform;
	}

	@keyframes SimplePulse {
		/* move in tailwind.config.js ? */
		0%,
		100% {
			transform: scale(1.05) translateY(-0.25rem); /* same as -translate-y-1 scale-105, looks like I cannot use @apply though... */
		}
		50% {
			transform: scale(1) translateY(0);
		}
	}

	.side-button.active {
		@apply brightness-110;
	}

	.side-button:hover {
		/* I cannot use &:hover in the previous class for whatever reason */
		@apply -translate-y-1 scale-105;
	}

	.side-button > * {
		/* same, cannot user & > * */
		@apply relative bottom-1;
	}

	.side-button > img {
		width: 6rem;
		@apply m-auto;
	}

	.side-button > span {
		@apply font-bold text-lg uppercase;
		text-shadow: 0.2rem 0.2rem 0.4rem black;
	}
</style>
