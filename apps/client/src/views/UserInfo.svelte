<script lang="ts">
	import { userStore } from "~/store"

	import DeDeVolonte from "../components/DeDeVolonte.svelte"

	const xpTable = [
		"110",
		"650",
		"1500",
		"2800",
		"4800",
		"7300",
		"10500",
		"14500",
		"19200",
		"25200"
	]
</script>

<div class="progression-wrapper">
	{#if $userStore}
		<h6 class:two-digits="{$userStore?.level > 9}" class="level">
			{$userStore?.level || "1"}
		</h6>
		<h6 class="username">{$userStore?.name || "Chargement"}</h6>
		<h6 class="current-xp">
			{$userStore?.currentXp || "0"} / {xpTable[$userStore?.level - 1] || "0"}
		</h6>
	{/if}
</div>

<div class="points-wrapper">
	<span class="mr-2">{$userStore?.points.toLocaleString("fr-FR") || "0"}</span>

	<DeDeVolonte />
</div>

<style lang="postcss">
	.points-wrapper {
		/* backgroundBlackTransparent.png is 318x69 (this / 3 = 106x23) */
		background-image: url("img/backgroundBlackTransparent.png");
		width: 10.6rem;
		height: 2.3rem;
		@apply bg-cover bg-center flex-initial px-2 flex justify-end items-center;
	}
	.progression-wrapper {
		background-image: url("img/level/levelShieldAndProgressionBar.png");
		width: 24rem;
		height: 6rem;
		@apply bg-cover bg-center relative flex-initial px-2 flex justify-start items-center;
	}
	.progression-wrapper > * {
		@apply absolute;
	}
	.level {
		top: 1.5rem;
		left: 2.3rem;
		@apply text-4xl;
	}
	.two-digits {
		left: 1.6rem;
	}
	.username {
		top: 1rem;
		left: 6.2rem;
	}
	.current-xp {
		right: 7.5rem;
		bottom: 1.1rem;
	}
</style>
