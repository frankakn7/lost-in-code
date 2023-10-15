<script>
import MaterialPreview from "$lib/components/MaterialPreview.svelte";

export let heading = "";

export let open = false;
</script>

<button type="button" class="collapse-button" on:click={() => open = !open}>
    <h2>{heading}</h2>
    {#if open}
        <h2><i class="fa fa-angle-down"/></h2>
    {:else}
        <h2><i class="fa fa-angle-up"/></h2>
    {/if}
</button>

{#if open}
    <slot />
{/if}

<style>
    .collapse-button {
        all: unset;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
        padding-left: 0;
        box-sizing: border-box;
        margin-top: 2rem;
    }

    .collapse-button h2 {
        margin: 0;
    }

    .collapse-button:hover {
        background-color: rgba(1, 1, 1, 0.1);
    }
</style>