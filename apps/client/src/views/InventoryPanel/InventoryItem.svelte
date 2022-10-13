<script lang="ts">
	import { Overlay } from "svelte-materialify"

	import { itemFetch } from "~/services/itemFetch"
	import { charactersStore, globalsStore, userStore } from "~/store"
	import { notificationStore } from "~/store"

	import CardActionButton from "../../components/CardActionButton.svelte"
	import Countdown from "../../components/Countdown.svelte"
	import ItemCard from "../../components/ItemCard.svelte"
	import Loading from "../../components/Loading.svelte"
	import Modal from "../../components/Modal.svelte"

	export let item: Item
	export let stock: number
	export let lastUsed: string | undefined

	let canUseAt = new Date()
	let canUse = false

	let sellingModalOpened = false
	let usingModalOpened = false

	let sellingPromise: Promise<void>
	let usingPromise: Promise<void>

	function use() {
		usingPromise = itemFetch
			.use(item._id, getCorrectTarget())
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `La carte "${item.name}" a bien été utilisé${item.targettable ? `sur ${getCorrectTarget()}` : ""} 👍`
					})
					usingModalOpened = false
					return notifications
				})
			})
			.catch(message => {
				notificationStore.update(notifications => {
					notifications.push({ notificationType: "error", message })
					usingModalOpened = false
					return notifications
				})
			})
	}

	$: sellingPrice = Math.floor(item.price / 2)

	function sell() {
		sellingPromise = itemFetch
			.sell(item._id)
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `La carte "${item.name}" a bien été vendu pour ${sellingPrice} dés de volonté 🎲`
					})
					sellingModalOpened = false
					return notifications
				})
			})
			.catch(message => {
				notificationStore.update(notifications => {
					notifications.push({ notificationType: "error", message })
					sellingModalOpened = false
					return notifications
				})
			})
	}

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

	// User cannot buy silver rarity and above cards if he's not following the chanel
	const checkIfFollowing = (item: Item) => {
		return item.rarity > 0 && !$userStore?.isFollowing
	}

	const computeDisableMessage = (item: Item) => {
		if (checkIfFollowing(item)) {
			return "Il faut suivre la chaîne pour pouvoir utiliser cette carte 🎁"
		}
		return "Cette carte ne peut pas encore être utilisée"
	}

	$: characters = [...$charactersStore.values()].filter(({ isActive }) => isActive).map(({ name }) => name)
	let target = ""
	let inputedTarget = ""

	function getCorrectTarget () {
		return inputedTarget ? inputedTarget : target
	}

	export let className = ""
</script>

{#if $globalsStore === undefined}
	<Loading />
{:else}
	<Modal
		opened="{sellingModalOpened}"
		title="{`Veux-tu vraiment vendre ${item.name} ?`}">
		<slot slot="body">
			<p class="text-center">
				Tu es sur le point de vendre {item.name} pour récupérer {sellingPrice} Dés de Volonté. Es-tu sûr de toi ?
			</p>
		</slot>

		<slot slot="footer">
			<div class="flex justify-evenly items-center">
				<button on:click="{() => (sellingModalOpened = false)}" class="cancel-button">Annuler</button>
				<button on:click="{sell}" class="confirm-button">Vendre</button>
			</div>
		</slot>
	</Modal>

	<Modal
		opened="{usingModalOpened}"
		title="{`Veux-tu vraiment utiliser ${item.name} ?`}">
		<slot slot="body">
			{#if item.targettable}
				<p class="text-center">
					Sur qui veux-tu utiliser {item.name} ?
				</p>
				<br />
				<label class="text-white-bold">
					Choisis une cible
					<select class="character-select" bind:value="{target}" on:change="{() => inputedTarget = ""}">
						{#each characters as character}
							<option value={character}>
								{character}
							</option>
						{/each}
						<option value={"Un PNJ"}>
							Un PNJ
						</option>
					</select>
				</label>
				{#if target === "Un PNJ"}
					<label class="text-white-bold">
						Nom du PNJ
						<input
							bind:value="{inputedTarget}"
							class="character-input"
							type="text"
							placeholder="Nom du PNJ" />
					</label>
				{/if}

				{:else}
				<p class="text-center">
					Tu es sur le point d'utiliser {item.name}. Es-tu sûr de toi ?
				</p>
			{/if}

		</slot>

		<slot slot="footer">
			<div class="flex justify-evenly items-center">
				<button on:click="{() => (usingModalOpened = false)}" class="cancel-button">Annuler</button>

				<CardActionButton
					buttonType="use"
					disabledMessage="{computeDisableMessage(item)}"
					disabled="{checkIfFollowing(item) || stock <= 0 || !canUse}"
					canUse={canUse}
					onClick={use}>
					{#if !canUse}
						<Countdown until="{canUseAt}" />
					{/if}
				</CardActionButton>
			</div>
		</slot>
	</Modal>

	<ItemCard item="{item}" badge="{stock}" className="{className}">
		<div class="flex justify-around w-full">
			<CardActionButton
				buttonType="use"
				disabledMessage="{computeDisableMessage(item)}"
				disabled="{checkIfFollowing(item) || stock <= 0 || !canUse}"
				canUse="{canUse}"
				small
				onClick="{() => (usingModalOpened = true)}">
				{#if !canUse}
					<Countdown until="{canUseAt}" />
				{/if}
			</CardActionButton>

			<CardActionButton
				buttonType="sell"
				disabled="{stock <= 0}"
				itemPrice="{sellingPrice}"
				small
				onClick="{() => (sellingModalOpened = true)}" />
		</div>
	</ItemCard>
{/if}

{#if sellingPromise}
	{#await sellingPromise}
		<Overlay>
			<img src="img/lvdd.png" alt="LVDD" style="width: 33vw" />
		</Overlay>
	{/await}
{/if}

{#if usingPromise}
	{#await usingPromise}
		<Overlay>
			<img src="img/lvdd.png" alt="LVDD" style="width: 33vw" />
		</Overlay>
	{/await}
{/if}

<style lang="postcss">
	button {
		width: 10.5rem;
		height: 3.7rem;
		background-size: 100% 100%;
		@apply font-black text-xl pb-1;
	}

	button:hover:not(:disabled) {
		@apply brightness-75;
	}

	button:active:not(:disabled) {
		@apply brightness-125;
	}

	.confirm-button {
		background-image: url("img/buttons/generic/greenButton.png");
		color: #045a39;
	}

	.cancel-button {
		background-image: url("img/buttons/generic/redButton.png");
		color: #5a0404;
	}

	.character-select {
		@apply block w-full appearance-none text-black bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight;
	}
	.character-select:hover {
		@apply border-gray-500;
	}
	.character-select:focus {
		@apply outline-none;
	}

	.character-input {
		@apply block w-full appearance-none text-black bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight;
	}
	.character-input:focus {
		@apply outline-none;
	}
</style>
