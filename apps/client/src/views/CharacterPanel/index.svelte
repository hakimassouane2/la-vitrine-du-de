<script lang="ts">
	import { charactersStore } from "~/store"
	import Loading from "../../components/Loading.svelte"
	import CharacterItem from "./CharacterItem.svelte"
</script>

{#if !$charactersStore}
	<Loading />
{:else}
	<div class="flex flex-wrap h-full w-1/3 flex-col">
		{#each [...$charactersStore.values()] as character (character._id)}
			{#if character.isActive}
				<CharacterItem character="{character}" />
			{/if}
		{/each}
	</div>
{/if}
