<script lang="ts">
	export let character: Character
</script>

<div
	class="character-portrait"
	style="background-image: url({character.portraitImgUrl})">
	<div class="character-card">
		<div class="header">
			{#if character.archetypeImgUrl}
				<img src="{character.archetypeImgUrl}" alt="Archétype du personnage" />
			{/if}
			<!-- <button class="character-button profile-button"></button>
            <button class="character-button statistics-button"></button>
            <button class="character-button state-button"></button> -->
		</div>

		<div class="footer">
			<h1 class="character-name">{character.name}</h1>
			{#if character.level}
				<h2 class="character-level">Lvl. {character.level}</h2>
			{/if}
		</div>
	</div>
</div>

<style type="postcss">
	.character-portrait {
		background-size: 105% 103%;
		background-position: center;
		@apply h-full w-full flex flex-col content-center justify-center justify-items-center items-center rounded-tr-md;
	}

	.character-card {
		background-image: url("img/characters/characterFrameBorderless.png");
		background-size: 100% 100%;
		@apply h-full w-full flex flex-col content-center justify-between justify-items-center items-center rounded-tr-md;
	}

	.header {
		@apply w-full flex flex-row justify-around mt-8 font-bold;
	}

	/* .character-button {
		background-size: 50% 50%;
		background-position: center;
		@apply flex flex-initial w-20 h-20 bg-black bg-opacity-50 rounded;
	}

	.profile-button {
		background-image: url("img/characters/icons/iconCharacterProfile.png");
	}

	.statistics-button {
		background-image: url("img/characters/icons/iconCharacterStatistics.png");
	}

	.state-button {
		background-image: url("/img/characters/icons/iconCharacterState.png");
	} */


	.footer {
		width: 93%;
		@apply flex flex-initial flex-col h-40 bg-black bg-opacity-50 mb-6 rounded-b-xl;
	}

	.character-name {
		font-family: 'Alata', sans-serif;
		@apply text-4xl pl-2 pt-2 pb-2;
	}

	.character-level {
		color: #cdc3c4;
		font-family: 'Alata', sans-serif;
		@apply text-3xl pl-2;
	}
</style>
