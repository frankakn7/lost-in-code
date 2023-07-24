<script lang="ts">
    import type {PageData} from './$types';
    import UserTable from '$lib/components/UserTable.svelte';
    import {goto} from "$app/navigation";
    import ConfirmModal from "$lib/components/ConfirmModal.svelte";

    export let data: PageData;

    let userArray = data.group.users;

    let showConfirm = false;

    let group = {...data.group};
    let originalGroup = {...data.group};
    let editing = false;

    let curriculums = data.curriculums

    let currentCurriculum = curriculums.find(curriculum => curriculum.id == group.curriculum_id);

    $: if (editing && group.curriculum_id) {
        currentCurriculum = curriculums.find(curriculum => curriculum.id == group.curriculum_id);
    }

    function handleEdit() {
        editing = true;
    }

    function handleCancel() {
        group = {...originalGroup};
        editing = false;
    }

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

    function handleSave() {
        console.log('Saving group:', group);
        if(group.curriculum_id == "null"){
            group.curriculum_id = null;
        }
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/groups/${group.id}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(group)
        }).then((response) => {
            if (!response.ok) {
                console.error('Network response was not ok');
            }
            response.json()
                .then(() => {
                    originalGroup = {...group};
                    editing = false;
                })
                .catch(error => console.error(error));
        }).catch(error => console.error('There has been a problem with your fetch operation: ', error));
    }


</script>

{#if showConfirm}
    <ConfirmModal on:close={() => showConfirm = false} on:confirm={handleDelete}>
        Are you sure you want to delete the group '{data.group.name}' with the id {data.group.id} ?
    </ConfirmModal>
{/if}

<div id="title-container">
    {#if editing}
        <input bind:value={group.name} />
    {:else}
        <h1>{group.name}</h1>
    {/if}
    <div>
        <button class="click-button" id="edit-button" on:click={handleEdit}><i class="fa fa-pencil" /></button>
        <button class="click-button" id="delete-button" on:click={() => showConfirm = true}><i class="fa fa-trash-can"/>
        </button>
    </div>
</div>

<h2>Description</h2>
<div>
    {#if editing}
        <textarea bind:value={group.description}></textarea>
    {:else}
        {group.description}
    {/if}
</div>

<h2>Curriculum</h2>
<div>
    {#if editing}
        <select bind:value={group.curriculum_id} required>
            <option value="null" selected>None</option>
            {#each curriculums as curriculum (curriculum.id)}
                <option value={curriculum.id}>{curriculum.name} ({curriculum.id})</option>
            {/each}
        </select>
    {:else}
        {#if currentCurriculum}
            <a href="/curriculums/{currentCurriculum.id}">{currentCurriculum.name} ({currentCurriculum.id})</a>
        {:else}
            None
        {/if}
    {/if}
</div>

<div id="button-container">
    {#if editing}
        <button class="click-button" id="save-button" on:click={handleSave}>Save</button>
        <button class="click-button" id="cancel-button" on:click={handleCancel}>Cancel</button>
    {:else}
    {/if}
</div>

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

    #edit-button {
        background-color: var(--yinmn-blue);
        padding: 0.5rem;
    }

    #save-button {
        background-color: var(--pigment-green);
        padding: 0.5rem;
    }

    #cancel-button {
        background-color: var(--imperial-red);
        padding: 0.5rem;
    }

    textarea,
    input {
        width: 50%;
        /*margin-top: 1rem;*/
        /*margin-bottom: 1rem;*/
    }

    textarea,
    select{
        font-size: 1rem;
    }

    input {
        font-size: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-weight: bold;
    }

    #button-container{
        margin-top: 2rem;
    }
</style>