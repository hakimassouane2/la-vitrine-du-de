<script lang="ts">
	import { Overlay } from "svelte-materialify"

	import { userFetch } from "~/services"
	import { notificationStore } from "~/store"

	import UserInventory from "./UserInventory.svelte"

	export let user: User

	let points = user.points.toString()

	let promise: Promise<void> | undefined

	function removePoints() {
		promise = userFetch
			.removePoints(user._id, parseInt(points))
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `${points} dés de volonté ont été enlevés de l'utilisateur ${user.name} 👍`
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

	function setPoints() {
		promise = userFetch
			.setPoints(user._id, parseInt(points))
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `Les dés de volonté de l'utilisateur ${user.name} ont été fixés à ${points} 👍`
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

	function addPoints() {
		promise = userFetch
			.addPoints(user._id, parseInt(points))
			.then(() => {
				notificationStore.update(notifications => {
					notifications.push({
						notificationType: "success",
						message: `${points} dés de volonté ont été ajoutés à l'utilisateur ${user.name} 👍`
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

<label class="text-white-bold">
	Nombre de points
	<input
		bind:value="{points}"
		class="point-input"
		type="text"
		placeholder="Nombre de points" />
</label>

<div>
	<button class="point-button" on:click="{() => removePoints()}">
		Retirer les points
	</button>

	<button class="point-button" on:click="{() => setPoints()}">
		Mettre à jour les points
	</button>

	<button class="point-button" on:click="{() => addPoints()}">
		Ajouter les points
	</button>
</div>

<UserInventory id="{user._id}" inventory="{user.inventory}" />

{#if promise}
	{#await promise}
		<Overlay>
			<img src="img/lvdd.png" alt="LVDD" style="width: 33vw" />
		</Overlay>
	{/await}
{/if}

<style type="postcss">
	.point-button {
		@apply bg-blue-500 text-white font-bold py-2 px-4 rounded-full;
	}
	.point-button:hover {
		@apply bg-blue-700;
	}
	.point-input {
		@apply block appearance-none text-black bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight;
	}
	.point-input:focus {
		@apply outline-none;
	}
</style>
