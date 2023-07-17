<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}
</script>

<div class="modal-backdrop" on:click={handleClose}>
	<div class="modal-content" on:click={(e) => e.stopPropagation()}>
		<button class="close-button" on:click={handleClose}><i class="fa fa-xmark"></button>
		<slot />
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		position: relative;
	}

	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
        font-size: 1.2rem;
        border-style: none;
        border-radius: 0.2rem;
        background-color: var(--imperial-red);
        color: var(--timberwolf);
        box-shadow: 1px 1px 2px gray;
        transition: all 0.2s;
	}

    .close-button:hover {
        cursor: pointer;
        transition: all 0.2s;
    }
</style>
