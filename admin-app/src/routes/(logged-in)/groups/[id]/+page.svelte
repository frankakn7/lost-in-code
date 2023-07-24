<script lang="ts">
    import type {PageData} from './$types';
    import UserTable from '$lib/components/UserTable.svelte';
    import {goto} from "$app/navigation";
    import ConfirmModal from "$lib/components/ConfirmModal.svelte";

    export let data: PageData;

    let userArray = data.group.users;

    let showConfirm = false

    function handleDelete() {
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/groups/${data.group.id}`, {
            method: 'DELETE',
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(`Group with id ${data.group.id} has been deleted.`);
                goto("/groups")
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation: ', error);
            });
    }


</script>

{#if showConfirm}
    <ConfirmModal on:close={() => showConfirm = false} on:confirm={handleDelete}>
        Are you sure you want to delete the group '{data.group.name}' with the id {data.group.id} ?
    </ConfirmModal>
{/if}

<div id="title-container">
    <h1>{data.group.name}</h1>
    <button class="click-button" id="delete-button" on:click={() => showConfirm = true}><i class="fa fa-trash-can"/>
    </button>
</div>
<div>{@html data.group.description}</div>

<h2>Users</h2>
<UserTable users={userArray}/>

<style>
    #title-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

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

    #delete-button {
        background-color: var(--imperial-red);
        padding: 0.5rem;
    }
</style>