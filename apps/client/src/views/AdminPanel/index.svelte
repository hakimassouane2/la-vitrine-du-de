<script lang="ts">
	import Tab from "../../components/Tab.svelte"

	import ItemsTab from "./ItemsTab.svelte"
	import UsersTab from "./UsersTab.svelte"

	let currentTab = 1;
	let tabItems = [
		{ label: "Utilisateurs", component: UsersTab, value: 1 },
		{ label: "Cartes", component: ItemsTab, value: 2 }
	];
</script>

<Tab bind:activeTabValue="{currentTab}" items="{tabItems}" />

{#each tabItems as { label, component, value } (label)}
	<div class:hidden="{value !== currentTab}">
		<svelte:component this="{component}" />
	</div>
{/each}
