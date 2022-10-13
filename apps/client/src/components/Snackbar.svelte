<script lang="ts">
	import { notificationStore } from "~/store"
	import { fade } from "svelte/transition"

	let lastNotification: ShopNotification | undefined

	$: {
		if ($notificationStore?.length > 0 && !lastNotification) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			lastNotification = $notificationStore.shift()!
			setTimeout(() => {
				lastNotification = undefined
			}, lastNotification.timeout || 2500)
		}
	}
</script>

{#if lastNotification}
	<div
		transition:fade
		class="text-center absolute rounded w-1/3 left-1/3 top-12 p-3 {lastNotification.notificationType}">
		{lastNotification.message}
	</div>
{/if}

<style lang="postcss">
	.success {
		@apply bg-green-500;
	}

	.warning {
		@apply bg-yellow-500;
	}

	.error {
		@apply bg-red-500;
	}

	.info {
		@apply bg-blue-500;
	}
</style>
