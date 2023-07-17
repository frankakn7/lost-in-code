<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

    export let user:any;

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
        console.log(user)
	}
</script>

<Modal on:close={handleClose}>
	<div class="modal-title">User Info</div>
</Modal>

<style>
	.modal-title {
		font-size: 1.1rem;
		font-weight: bold;
	}
</style>
