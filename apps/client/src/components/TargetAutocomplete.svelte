<script lang="ts">
	import { charactersStore } from "~/store"

	import Autocomplete from "./Autocomplete.svelte"

	export let target: string

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	$: characters = [...$charactersStore.values()].filter(({ isActive }) => isActive).map(({ name }) => name)
</script>

<Autocomplete
	bind:value="{target}"
	options="{characters}"
	notFoundText="Aucun de nos vaillants héros ne se nomme ainsi, mais tu peux préciser la cible de ton choix !" />
