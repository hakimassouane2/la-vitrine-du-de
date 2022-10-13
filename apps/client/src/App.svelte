<script lang="ts">
	import Loading from "./components/Loading.svelte"
	import Snackbar from "./components/Snackbar.svelte"
	import Root from "./views/Root.svelte"
	import { userFetch } from "./services"

	let last_width: number

	window.Twitch.ext.onContext(ctx => {
		if (!ctx.arePlayerControlsVisible && !isPanelOpen) {
			isPanelVisible = false
		} else {
			isPanelVisible = true
		}

		var width = document.body.offsetWidth / 1920 - 0.03
		if (last_width != width) {
			last_width = width
			document.getElementById("canvas").style.transform = "scale(" + width + ")"
		}
	})

	const twitchPromise = new Promise<void>((resolve, reject) => {
		Twitch.ext.onAuthorized(_auth => {
			if (Twitch.ext.viewer.isLinked) {
				userFetch
					.check(Twitch.ext.viewer.id)
					.then(() => {
						resolve()
					})
					.catch(error =>
						reject(`Quelque chose d'inattendu s'est produit : ${error}`)
					)
			} else {
				reject(
					"Tu dois partager les informations de ton compte Twitch avec l'extension avant de pouvoir utiliser la vitrine !"
				)
			}
		})
	})

	let isPanelOpen = false
	let isPanelVisible = false
</script>

<div id="canvas" class:invisible="{!isPanelVisible}">
	<div class:hidden="{isPanelOpen}" class="panel-closed">
		<img
			class="opening-banner"
			src="img/sideBanner.png"
			alt="Bouton d'ouverture / Fermeture"
			on:click="{() => {
				isPanelOpen = !isPanelOpen
			}}" />
	</div>

	<main
		class:hidden="{!isPanelOpen}"
		class:grid="{isPanelOpen}"
		class="main-panel">
		<Snackbar />

		<img
			class="closing-banner"
			src="img/sideBanner.png"
			alt="Bouton d'ouverture / Fermeture"
			on:click="{() => {
				isPanelOpen = !isPanelOpen
			}}" />

		{#await twitchPromise}
			<Loading />

			<p class="italic text-lg text-red-600">
				Si tu rencontres des problèmes avec La Vitrine Du Dé, tentes de désactiver ton AdBlocker.

				<br />

				La Vitrine Du Dé n'utilise aucune publicité, mais la technologie utilisée (websocket pour les curieux) peut être considérée comme telle par certain AdBlocker.

				<br />

				Désolé pour la gêne occasionnée !
			</p>
		{:then}
			<Root />
		{:catch error}
			<section class="content-connect-twitch">
				<img class="logo-lvdd" src="img/lvdd.png" alt="logo lvdd" />

				<p class="connect-twitch-text">{error}</p>

				<!-- svelte-ignore missing-declaration -->
				<button
					class="connect-twitch-btn"
					on:click="{Twitch.ext.actions.requestIdShare}">
					Connecte-toi !
				</button>
			</section>
		{/await}
	</main>
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	body {
		@apply text-gray-200 font-sans;
		font-family: 'Alata', sans-serif;
		display: flex;
		align-items: center;
	}

	#canvas {
		position: fixed;
		transform-origin: left;
	}

	.main-panel {
		/* panelBackground.png is 1491x933 (this / 1.5 = 994x622) */
		background-image: url("img/panelBackground.png");
		width: 99.4rem;
		height: 62.2rem;
		@apply relative bg-cover bg-center grid-rows-6 grid-cols-7;
	}

	.logo-lvdd {
		max-width: 6rem;
		@apply block mb-4 ml-auto mr-auto;
	}

	.content-connect-twitch {
		@apply row-span-6 col-span-7 inset-0 m-auto;
	}

	.connect-twitch-text {
		@apply text-white font-bold text-xl;
	}

	.connect-twitch-btn {
		width: 10.5rem;
		height: 3.7rem;
		background-image: url("img/buttons/generic/purpleButton.png");
		color: #371055;
		@apply block bg-cover bg-center font-bold flex flex-initial items-center justify-center ml-auto mr-auto text-xl;
	}

	.panel-closed {
		background-image: url("img/panelBackgroundClosed.png");
		width: 99.4rem;
		height: 62.2rem;
		@apply relative bg-cover bg-center;
	}

	.opening-banner {
		animation: Grow 3s ease-in-out infinite;
		@apply absolute max-h-full max-w-full w-auto h-auto top-0 bottom-0 -left-3 right-0 m-auto ml-0;
	}

	.opening-banner:hover {
		@apply brightness-110 cursor-pointer;
	}

	@keyframes Grow {
		/* move in tailwind.config.js ? */
		0%,
		100% {
			transform: translateX(2%);
		}
		50% {
			transform: translateX(-15%);
		}
	}

	.closing-banner {
		z-index: 5;
		@apply absolute transform rotate-180 max-h-full max-w-full w-auto h-auto top-0 bottom-0 left-0 -right-2 m-auto mr-0;
	}

	.closing-banner:hover {
		@apply brightness-110 cursor-pointer;
	}
</style>
