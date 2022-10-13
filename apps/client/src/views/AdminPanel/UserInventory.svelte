<script lang="ts">
	import { Overlay } from "svelte-materialify"

	import { userFetch } from "~/services"
	import { itemsStore, notificationStore } from "~/store"

	export let id: string

	export let inventory: { [itemId: string]: InventoryData }

	let newItemId = ""

	let promise: Promise<void> | undefined

	function inventoryAdd() {
		if (!newItemId || !$itemsStore.has(newItemId)) return

		inventory[newItemId] = { stock: 1 }

		promise = userFetch
			.setInventory(id, inventory)
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `La carte "${
							$itemsStore.get(newItemId).name
						}" a bien été ajouté 👍`
					})
					return notifications
				})

				newItemId = ""
			})
			.catch(message => {
				notificationStore.update(notifications => {
					notifications.push({ notificationType: "error", message })
					return notifications
				})
			})
	}

	function inventoryInputAdd(event: Event, itemId: string) {
		inventory[itemId] = { stock: parseInt(event.target.value) }
		promise = userFetch
			.setInventory(id, inventory)
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `La carte "${
							$itemsStore.get(itemId).name
						}" a bien été ajouté ${event.target.value} fois 👍`
					})
					return notifications
				})

				newItemId = ""
			})
			.catch(message => {
				notificationStore.update(notifications => {
					notifications.push({ notificationType: "error", message })
					return notifications
				})
			})
	}
</script>

{#each Object.entries(inventory) as [itemId, { stock }] (itemId)}
	<label class="text-white-bold">
		{$itemsStore.get(itemId).name}
		<input
			value="{stock.toString()}"
			class="inventory-input"
			type="text"
			placeholder="{$itemsStore.get(itemId).name}"
			on:change="{e => inventoryInputAdd(e, itemId)}" />
	</label>
{/each}

<label class="text-white-bold">
	Choisis une carte
	<select class="inventory-select" bind:value="{newItemId}">
		{#each [...$itemsStore.values()].filter(({ _id }) => !(_id in inventory)) as { _id, name } (_id)}
			<option value="{_id}">
				{name}
			</option>
		{/each}
	</select>
</label>

<button class="inventory-button" on:click="{() => inventoryAdd()}">
	Ajouter cette carte
</button>

{#if promise}
	{#await promise}
		<Overlay>
			<img src="img/lvdd.png" alt="LVDD" style="width: 33vw" />
		</Overlay>
	{/await}
{/if}

<style type="postcss">
	.inventory-select {
		@apply block appearance-none text-black bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight;
	}
	.inventory-select:hover {
		@apply border-gray-500;
	}
	.inventory-select:focus {
		@apply outline-none;
	}
	.inventory-button {
		@apply bg-blue-500 w-48 text-white font-bold py-2 px-4 rounded-full;
	}
	.inventory-button:hover {
		@apply bg-blue-700;
	}
	.inventory-input {
		@apply block appearance-none text-black bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight;
	}
	.inventory-input:focus {
		@apply outline-none;
	}
</style>
