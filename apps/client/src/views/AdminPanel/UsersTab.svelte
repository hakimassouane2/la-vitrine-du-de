<script lang="ts">
	import { usersStore } from "~/store"

	import Loading from "../../components/Loading.svelte"
	import User from "./User.svelte"

	let userId: string
</script>

{#if !$usersStore}
	<Loading />
{:else}
	<a
		href="https://id.twitch.tv/oauth2/authorize?client_id=101rf90pzas0kji4gxqf6tbsa1qura&redirect_uri=https://lavitrinedude.click&response_type=token&scope=channel:read:subscriptions user:read:email bits:read"
		target="_blank">
		Login
	</a>

	<label class="text-white-bold">
		Choisir un utilisateur

		<select class="admin-select" bind:value="{userId}">
			{#each [...$usersStore.values()] as { _id, name } (_id)}
				<option value="{_id}">
					{name}
				</option>
			{/each}
		</select>
	</label>

	{#if userId}
		<User user="{$usersStore.get(userId)}" />
	{/if}
{/if}


<style type="postcss">
	.admin-select {
		@apply block appearance-none text-black bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight;
	}

	.admin-select:focus {
		@apply outline-none;
	}

	.admin-select:hover {
		@apply border-gray-500;
	}
</style>
