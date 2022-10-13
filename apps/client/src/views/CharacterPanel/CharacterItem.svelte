<script lang="ts">
	import CharacterCard from "../../components/CharacterCard.svelte"

	export let character: Character
</script>

<div class="h-full w-full p-1 character-card">
	<CharacterCard character="{character}" />
</div>

<style type="postcss">
	.character-card:hover {
		@apply brightness-110;
	}
</style>
