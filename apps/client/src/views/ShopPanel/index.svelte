<script lang="ts">
	import { userStore, itemsStore } from "~/store"

	import ShopItemCard from "./ShopItemCard.svelte"

	import Loading from "../../components/Loading.svelte"

	$: userTotalStock = Object.values($userStore?.inventory || {}).reduce(
		(total, { stock }) => total + stock,
		0
	)
</script>

{#if !$userStore || $itemsStore?.size === 0}
	<Loading />
{:else}
	<div class="flex flex-wrap h-full w-full custom-scroll">
		{#each [...$itemsStore.values()] as item (item._id)}
			{#if item.isActive}
				<ShopItemCard
					item="{item}"
					userIsFollowing="{$userStore.isFollowing}"
					userPoints="{$userStore.points}"
					userTotalStock="{userTotalStock}"
					userMaxInventorySize="{$userStore.maxInventorySize}"
					lastUsed="{$userStore?.inventory?.[item._id]?.lastUsed}" />
			{/if}
		{/each}
	</div>
{/if}
