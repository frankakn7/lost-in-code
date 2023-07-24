<script lang="ts">
    import type {PageData} from './$types';
    import {goto} from "$app/navigation";

    export let data: PageData;

    let name = '';
    let description = '';
    let curriculumId = 'null';
    const curriculums = data.curriculums;

    console.log(curriculums)

    function handleSubmit() {
        const formData = {name, description, curriculumId: curriculumId === 'null' ? null : curriculumId};
        console.log(formData);
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/groups/`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then((response) => {


            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            response.json().then((responseData) => goto("/groups/" + responseData.insertId)).catch(error => console.error(error));
        }).catch(error => console.error('There has been a problem with your fetch operation: ', error));
    }
</script>

<h1>Add Group</h1>
<form on:submit|preventDefault={handleSubmit}>
    <table>
        <tr>
            <td>
                <label for="name">Name:</label>
            </td>
            <td>
                <input id="name" bind:value={name} type="text" required/>
            </td>
        </tr>
        <tr>
            <td>
                <label for="description">Description:</label>
            </td>
            <td>
                <textarea id="description" bind:value={description} required></textarea>
            </td>
        </tr>
        <tr>
            <td>
                <label for="curriculumId">Curriculum ID:</label>
            </td>
            <td>
                <select id="curriculumId" bind:value={curriculumId} required>
                    <option value="null" selected>None</option>
                    {#each curriculums as curriculum (curriculum.id)}
                        <option value={curriculum.id}>({curriculum.id}) {curriculum.name}</option>
                    {/each}
                </select>
            </td>
        </tr>
    </table>
    <button type="submit" class="click-button" id="submit-button">Submit</button>
    <button type="button" class="click-button" id="cancel-button" on:click={() => goto("/groups")}>Cancel</button>
</form>

<style>
    table {
        text-align: left;
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 2rem;
    }

    tr:nth-child(even) {
        background-color: rgba(var(--yinmn-blue-rgb), 0.2);
    }

    td:not(:last-child) {
        border-right: 2px solid var(--yinmn-blue);
    }

    td {
        padding: 0.5rem;
    }

    input,
    textarea,
    select {
        font-size: 1rem;
        width: 80%;
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

    #submit-button {
        background-color: var(--pigment-green);
        margin-right: 1rem;
    }

    #cancel-button {
        background-color: var(--imperial-red);
    }
</style>