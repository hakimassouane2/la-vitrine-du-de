<script lang="ts">
	import { categories, rarities } from "@la-vitrine-du-de/db-typings"
	import type { Category, Rarity } from "@la-vitrine-du-de/db-typings"

	import Card from "../components/Card.svelte"

	const categoriesColor: Record<Category, string> = {
		Bonus: "green",
		Malus: "red",
		Neutre: "yellow",
		Autre: "white"
	}

	const raritiesColor: Record<Rarity, string> = {
		Bronze: "bronze",
		Argent: "silver",
		Or: "gold",
		Platine: "platinum",
		Diamant: "diamond"
	}

	export let item: Item

	const itemRarity = rarities[item.rarity]
	const itemCategory = categories[item.category]

	export let className = ""
	export let badge = 0
</script>

<Card className="item-card {className}">
	<div slot="header" class="header {raritiesColor[itemRarity]}">
		<span class="{categoriesColor[itemCategory]}-text pb-1"
			>{itemCategory}</span>

		{#if item.imageUrl}
			<div class="relative">
				<img src="{item.imageUrl}" alt="icon" />
				{#if badge > 0}
					<span class="badge">x{badge}</span>
				{/if}
			</div>
		{/if}

		<h6 class="mt-2 text-lg font-black">{item.name}</h6>
	</div>

	<div slot="body" class="body">
		{item.description}
	</div>

	<slot slot="footer" />
</Card>

<style type="postcss">
	:global(.item-card) {
		background-image: url("img/cards/cardBackground.png");
		background-size: 100% 100%;
	}

	.header {
		@apply flex flex-initial flex-col content-center justify-center justify-items-center items-center text-center font-black;
	}

	.header img {
		@apply w-16 h-16 border-double border-2 rounded bg-opacity-40;
	}

	.header.bronze img {
		background-color: #a1765277;
		border-color: #a17652;
	}
	.header.bronze > h6 {
		color: #a17652;
	}

	.header.silver img {
		background-color: #d6d6d677;
		border-color: #d6d6d6;
	}
	.header.silver > h6 {
		color: #d6d6d6;
	}

	.header.gold img {
		background-color: #ffd70077;
		border-color: #ffd700;
	}
	.header.gold > h6 {
		color: #ffd700;
	}

	.header.platinum img {
		background-color: #bef7d577;
		border-color: #bef7d5;
	}
	.header.platinum > h6 {
		color: #bef7d5;
	}

	.header.diamond img {
		background-color: #b9f2ff77;
		border-color: #b9f2ff;
	}
	.header.diamond > h6 {
		color: #b9f2ff;
	}

	.body {
		text-align-last: center;
		@apply flex-grow flex text-justify items-center text-base;
	}

	.green-text {
		--tw-text-opacity: 1;
		color: rgba(16, 185, 129, var(--tw-text-opacity));
	}

	.red-text {
		--tw-text-opacity: 1;
		color: rgba(239, 68, 68, var(--tw-text-opacity));
	}

	.yellow-text {
		--tw-text-opacity: 1;
		color: rgba(245, 158, 11, var(--tw-text-opacity));
	}

	.white-text {
		--tw-text-opacity: 1;
		color: rgba(255, 255, 255, var(--tw-text-opacity));
	}

	.badge {
		@apply absolute top-2 right-0.5 inline-flex items-center justify-center px-2 py-1 text-base font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-900 rounded-full;
	}
</style>
