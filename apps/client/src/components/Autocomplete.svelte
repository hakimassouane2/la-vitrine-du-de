<script lang="ts">
	export let value: string
	export let options: string[]
	export let notFoundText: string | undefined

	$: filteredOptions = options.filter(o =>
		o.toLowerCase().includes(value.toLowerCase())
	)
</script>

<div class="relative">
	<input bind:value />

	<div>
		<ul class="py-1">
			{#each filteredOptions as option (option)}
				<li
					class="px-3 py-2 cursor-pointer hover:bg-gray-200"
					on:click="{() => (value = option)}">
					{option}
				</li>
			{/each}

			<li
				class="px-3 py-2 cursor-pointer hover:bg-gray-200"
				on:click="{() => (value = "Un PNJ")}">
				Un PNJ
			</li>

			{#if filteredOptions.length === 0 && notFoundText}
				<li class="px-3 py-2 text-center">
					{notFoundText}
				</li>
			{/if}
		</ul>
	</div>
</div>
