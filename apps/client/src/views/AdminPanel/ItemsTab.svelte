<script lang="ts">
	import { Overlay } from "svelte-materialify"

	import Loading from "~/components/Loading.svelte";
	import { itemFetch } from "~/services"
	import { itemsStore, notificationStore } from "~/store"

	let updatePromise: Promise<void>

	function updateItem(item: Item) {
		updatePromise = itemFetch
			.update(item._id)
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `La carte "${
							$itemsStore.get(item._id).name
						}" a bien été mis à jour 👍`
					})
					return notifications
				})
			})
			.catch(message => {
				notificationStore.update(notifications => {
					notifications.push({ notificationType: "error", message })
					return notifications
				})
			})
	}
</script>

{#if $itemsStore?.size === 0}
	<Loading />
{:else}
	{#each [...$itemsStore.values()] as item (item._id)}
		<h6>{item.name}</h6>

		<div>
			<button class="item-button" on:click="{() => updateItem(item)}"
				>Mettre à jour la carte</button>
		</div>
	{/each}
{/if}

{#if updatePromise}
	{#await updatePromise}
	<Overlay>
		<img src="img/lvdd.png" alt="LVDD" style="width: 33vw" />
	</Overlay>
	{/await}
{/if}

<style type="postcss">
	.item-button {
		@apply bg-blue-500 text-white font-bold py-2 px-4 rounded-full;
	}

	.item-button:hover {
		@apply bg-blue-700;
	}
</style>
