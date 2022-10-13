<script lang="ts">
	export let className = ""
</script>

<img
	src="img/buttons/iconDeDeVolonte.png"
	alt="dé de volonté"
	class="{className}" />

<style lang="postcss">
	@keyframes Wiggle {
		/* move in tailwind.config.js ? */
		0%,
		100% {
			transform: scale(0.9);
		}
		50% {
			transform: scale(1);
		}
	}

	img {
		@apply inline max-h-10 h-5/6;
		animation: Wiggle 3s ease-in-out infinite;
	}
</style>
