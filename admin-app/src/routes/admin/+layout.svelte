<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
</script>
	<main>
		<slot />
	</main>

<style>
	:global(body) {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: var(--timberwolf);
	}

	:global(input) {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}

	:global(:root) {
		--moonstone: #0fa3b1ff;
		--timberwolf: rgb(247, 243, 240);
		--yinmn-blue: #3e536dff;
		--imperial-red: #e54b4bff;
		--pigment-green: #4aad52ff;

		--yinmn-blue-rgb: 62, 83, 109;

		/* $moonstone: rgba(15, 163, 177, 1);
		$timberwolf: rgba(228, 223, 218, 1);
		$yinmn-blue: rgba(62, 83, 109, 1);
		$imperial-red: rgba(229, 75, 75, 1);
		$pigment-green: rgba(74, 173, 82, 1); */
	}
</style>
