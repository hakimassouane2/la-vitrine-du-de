<script lang="ts">
	import { userStore } from "~/store"

	import SideButton from "../components/SideButton.svelte" // why cannot I use ~ for svelte component?

	import AdminPanel from "./AdminPanel/index.svelte"
	import InventoryPanel from "./InventoryPanel/index.svelte"
	import ShopPanel from "./ShopPanel/index.svelte"
	import CharcaterPanel from "./CharacterPanel/index.svelte"
	import UserInfo from "./UserInfo.svelte"

	let buttons = [
		{
			label: "Boutique",
			component: ShopPanel,
			icon: "img/buttons/iconShop.png"
		},
		{
			label: "Inventaire",
			component: InventoryPanel,
			icon: "img/buttons/iconInventory.png"
		},
		{
			label: "Personnages",
			component: CharcaterPanel,
			icon: "img/buttons/iconCharacter.png",
			className: "w-full custom-scroll-x"
		},
		{
			label: "Admin",
			component: AdminPanel,
			icon: "img/buttons/iconGear.png",
			className: "flex-col custom-scroll",
			admin: true
		}
	]

	let buttonIndex = 0
</script>

<div class="topbar">
	<UserInfo />
</div>

<nav class="sidebar">
	{#each buttons as { label, icon, admin }, index (label)}
		{#if !admin || $userStore?.isAdmin}
			<SideButton
				label="{label}"
				icon="{icon}"
				onClick="{() => (buttonIndex = index)}"
				active="{index === buttonIndex}" />
		{/if}
	{/each}
</nav>

<section class="content">
	{#each buttons as { label, component, className, admin }, index (label)}
		{#if !admin || $userStore?.isAdmin}
			<div
				class:hidden="{index !== buttonIndex}"
				class:flex="{index === buttonIndex}"
				class="h-full {className}">
				<svelte:component this="{component}" />
			</div>
		{/if}
	{/each}
</section>

<style lang="postcss">
	.sidebar {
		@apply row-span-5 flex flex-col content-center justify-center justify-items-center items-center mb-12;
	}

	.topbar {
		@apply col-span-7 flex content-center justify-between justify-items-center items-center mt-11 mr-20 ml-11;
	}

	.content {
		@apply row-span-5 col-span-6 mr-12 mb-10;
	}
</style>
