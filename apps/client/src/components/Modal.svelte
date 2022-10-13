<script lang="ts">
	export let opened: boolean
	export let title: string
</script>

{#if opened}
	<div
		class="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
		<div class="modal-overlay fixed w-full h-full bg-gray-900 opacity-50"></div>

		<div class="modal-panel w-full lg:h-max lg:w-5/12 mx-auto rounded-lg shadow-xl z-50 overflow-y-auto;">
			<div class="flex justify-center items-center head py-5 px-8 text-xl font-extrabold">
				{title}
			</div>

			<div class="content p-8">
				<slot name="body" />
			</div>

			<div class="content p-8 pt-0">
				<slot name="footer" />
			</div>
		</div>
	</div>
{/if}

<style type="postcss">
	.modal-panel {
		background-image: url("img/modalBackground.png");
		background-size: 100% 100%;
	}
</style>
