<script lang="ts">
	export let title = ""
	export let content = ""
	export let footer = ""
	export let className = ""
</script>

<div class="card {className}">
	<slot name="header">
		{#if title}
			<h3>{title}</h3>
		{/if}
	</slot>

	<slot name="body">
		{#if content}
			<div>{content}</div>
		{/if}
	</slot>

	<slot name="footer">
		{#if footer}
			<div>{footer}</div>
		{/if}
	</slot>
</div>

<style lang="postcss">
	.card {
		@apply p-6 flex flex-col h-full content-center justify-center justify-items-center items-center shadow-md rounded-tr-md;
	}
</style>
