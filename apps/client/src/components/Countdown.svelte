<script lang="ts">
	import { tweened } from "svelte/motion"

	export let until: Date

	$: timer = tweened((until.getTime() - new Date().getTime()) / 1000)

	setInterval(() => {
		if ($timer > 0) {
			$timer -= 1
		}
	}, 1000)

	$: minutes = Math.floor($timer / 60)
	$: seconds = Math.floor($timer - minutes * 60)
</script>

<p class="text-lg">
	{minutes}:{seconds.toString().padStart(2, "0")}
</p>
