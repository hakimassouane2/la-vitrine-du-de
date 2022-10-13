<script lang="ts">
	import { userStore, itemsStore } from "~/store"

	import Loading from "../../components/Loading.svelte"
	import InventoryItem from "./InventoryItem.svelte"

	let inventory: { item: Item; stock: number; lastUsed: Date | undefined }[] =
		[]

	$: inventory = $userStore?.inventory
		? Object.entries($userStore.inventory)
				.filter(([itemId]) => $itemsStore?.has(itemId))
				.map(([itemId, { stock, lastUsed }]) => {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return { item: $itemsStore.get(itemId)!, stock, lastUsed }
				})
				.sort(({ item: itemA }, { item: itemB }) => {
					if (itemA.rarity === itemB.rarity) {
						return itemA.price - itemB.price
					}
					return itemA.rarity - itemB.rarity
				})
		: []
</script>

{#if $userStore === undefined || $itemsStore.size === 0}
	<Loading />
{:else}
	<div class="flex flex-wrap h-full w-full custom-scroll">
		{#each inventory as { item, stock, lastUsed } (item._id)}
			<div class="h-2/4 w-1/4 p-1 {!stock ? 'hidden' : ''}">
				<InventoryItem item="{item}" stock="{stock}" lastUsed="{lastUsed}" />
			</div>
		{/each}
	</div>
{/if}
