<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleConfirm(){
		dispatch('confirm');
	}
</script>

<Modal on:close={handleClose}>
	<div id="modal-content">
		<h2 class="modal-title">Are you sure?</h2>
		<div id="text">
			<slot/>
		</div>
		<div id="button-container">
			<button type="button" class="click-button" id="confirm-button" on:click={handleConfirm}>Confirm</button>
			<button type="button" class="click-button" id="cancel-button" on:click={handleClose}>Cancel</button>
		</div>
	</div>
</Modal>

<style>
	.click-button {
		padding: 0.4rem;
		cursor: pointer;
		border-style: none;
		border-radius: 0.2rem;
		background-color: var(--yinmn-blue);
		color: var(--timberwolf);
		font-size: 1rem;
		/* box-shadow: 2px 2px 2px gray; */
		transition: all 0.2s;
	}

	.click-button:hover {
		/* transform: translate(-2px,-2px); */
		scale: 1.1;
		/* box-shadow: 4px 4px 2px gray; */
		transition: all 0.2s;
	}

	.click-button:active {
		scale: 0.9;
		transition: all 0.2s;
	}

	#cancel-button {
		background-color: var(--imperial-red);
		padding: 0.5rem;
	}

	#confirm-button {
		background-color: var(--pigment-green);
		margin-right: 1rem;
	}

	#text{
		margin: 1rem;
	}

	#button-container {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		width: 100%;
		margin: 1rem;
	}

	#modal-content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
</style>
