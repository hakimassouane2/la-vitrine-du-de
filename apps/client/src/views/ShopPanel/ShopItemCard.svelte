<script lang="ts">
	import { Overlay } from "svelte-materialify"

	import { itemFetch } from "~/services/itemFetch"
	import { globalsStore, notificationStore } from "~/store"

	import CardActionButton from "../../components/CardActionButton.svelte"
	import Countdown from "../../components/Countdown.svelte"
	import ItemCard from "../../components/ItemCard.svelte"
	import Modal from "../../components/Modal.svelte"

	export let item: Item
	export let userIsFollowing: boolean
	export let userPoints: number
	export let userTotalStock: number
	export let userMaxInventorySize: number

	let modalOpened = false

	let buyingPromise: Promise<void>

	function buy() {
		buyingPromise = itemFetch
			.buy(item._id)
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `${item.name} est désormais dans ton inventaire 🎒`
					})
					modalOpened = false
					return notifications
				})
			})
			.catch(message => {
				notificationStore.update(notifications => {
					notifications.push({ notificationType: "error", message })
					modalOpened = false
					return notifications
				})
			})
	}

	let disabledMessage = ""
	$: hasInventorySpace = userTotalStock < userMaxInventorySize
	$: hasEnoughPoints = item.price <= userPoints
	$: isNotVip = !userIsFollowing && item.rarity > 0

	$: {
		if (!hasInventorySpace) {
			disabledMessage = `Tu n'as pas assez de place dans ton inventaire (${userTotalStock}/${userMaxInventorySize}) 🎒 Pense à sub pour avoir plus de place !`
		} else if (isNotVip) {
			disabledMessage = `Tu dois suivre la chaîne pour pouvoir acheter cette carte 🎁`
		} else if (!hasEnoughPoints) {
			disabledMessage = `Tu n'as pas assez de points pour acheter cette carte 🎲`
		} else {
			disabledMessage = ""
		}
	}

	// Cooldown

	export let lastUsed: string | undefined

	let canUseAt = new Date()
	let canUse = false
	let timeout: NodeJS.Timeout

	$: {
		const globalsLastUsedDate = new Date($globalsStore?.lastUsed || 0)
		const itemLastUsedDate = new Date(item.lastUsed || 0)

		const globalsCanUseAt = new Date(
			globalsLastUsedDate.getTime() + parseInt(import.meta.env.VITE_GLOBAL_COOLDOWN)
		)
		const globalItemCanUseAt = new Date(
			itemLastUsedDate.getTime() + item.globalCooldown
		)
		const userItemCanUseAt = new Date(
			new Date(lastUsed || 0).getTime() + item.userCooldown
		)

		canUseAt = new Date(
			Math.max(
				globalsCanUseAt.getTime(),
				globalItemCanUseAt.getTime(),
				userItemCanUseAt.getTime()
			)
		)

		const ms = canUseAt.getTime() - new Date().getTime()

		if (ms <= 0) {
			canUse = true
		} else {
			canUse = false
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				canUse = true
			}, ms)
		}
	}
</script>

<Modal
	opened="{modalOpened}"
	title="{`Veux-tu vraiment acheter ${item.name} ?`}">
	<slot slot="body">
		<p class="text-center">
			Tu es sur le point de dépenser {item.price} Dés de Volonté pour acquérir {item.name}. Es-tu sûr de toi ?
		</p>
	</slot>

	<slot slot="footer">
		<div class="flex justify-evenly items-center">
			<button on:click="{() => (modalOpened = false)}" class="cancel-button">Annuler</button>
			<button on:click="{buy}" class="confirm-button">Acheter</button>
		</div>
	</slot>
</Modal>

<div class="h-2/4 w-1/4 p-1">
	<ItemCard item="{item}">
		{#if !canUse}
			<p class="text-yellow-500 text-base text-center font-bold mb-px">
				Prochaine utilisation dans : <Countdown until="{canUseAt}" />
			</p>
		{/if}

		<CardActionButton
			buttonType="buy"
			disabledMessage="{disabledMessage}"
			disabled="{!!disabledMessage}"
			itemPrice="{item.price}"
			onClick="{() => (modalOpened = true)}" />
	</ItemCard>
</div>

{#if buyingPromise}
	{#await buyingPromise}
		<Overlay>
			<img src="img/lvdd.png" alt="LVDD" style="width: 33vw" />
		</Overlay>
	{/await}
{/if}

<style lang="postcss">
	button {
		width: 10.5rem;
		height: 3.7rem;
		@apply font-black text-xl pb-1 ;
	}

	button:hover:not(:disabled) {
		@apply brightness-75;
	}

	button:active:not(:disabled) {
		@apply brightness-125;
	}

	.confirm-button {
		background-image: url("img/buttons/generic/greenButton.png");
		background-size: 100% 100%;
		color: #045a39;
	}

	.cancel-button {
		background-image: url("img/buttons/generic/redButton.png");
		background-size: 100% 100%;
		color: #5a0404;
	}
</style>
