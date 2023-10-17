<script lang="ts">
    import {goto} from "$app/navigation";
    import type {PageData} from './$types';
    import CollapseContainer from "$lib/components/CollapseContainer.svelte";

    export let data: PageData;

    // let name = '';
    // let description = '';

    let updatedCurriculum = {...data.curriculum}

    let chaptersArray = data.chapters;
    chaptersArray.sort((a, b) => a.order_position - b.order_position);

    async function updateChapterOrderPosition(chapter) {
        try {
            const formData = { ...chapter };
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/chapters/${chapter.id}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Do something after fetch is done, e.g., return some data
            return;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }


    async function updateAllOrderPositions(chapters) {
        await Promise.all(chaptersArray.map(updateChapterOrderPosition));
        return
    }

    function handleSubmit() {
        const formData = {
            name: updatedCurriculum.name,
            description: updatedCurriculum.description
        };
        console.log(formData);
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/curriculums/${data.curriculum.id}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            updateAllOrderPositions(chaptersArray).then((x) => {
                console.log("####GOTO")
                goto("/curriculums/" + data.curriculum.id)
            }).catch((err) => {
                throw new Error(err)
            });
        }).catch(error => console.error('There has been a problem with your fetch operation: ', error));
    }

    let draggedIndex;

    function dragStartHandler(event, index) {
        draggedIndex = index;
        event.dataTransfer.effectAllowed = "move";
    }

    function dragOverHandler(event, index) {
        event.preventDefault();
        if (index !== draggedIndex) {
            // Swap elements and update the draggedIndex
            [chaptersArray[draggedIndex], chaptersArray[index]] = [chaptersArray[index], chaptersArray[draggedIndex]];
            for (let i in chaptersArray) {
                chaptersArray[i].order_position = +i + 1;
            }
            draggedIndex = index;
        }
    }
</script>

<h1>Edit Curriculum ({data.curriculum.id})</h1>
<form on:submit|preventDefault={handleSubmit}>
    <table>
        <tr>
            <td>
                <label for="name">Name:</label>
            </td>
            <td>
                <input id="name" bind:value={updatedCurriculum.name} type="text" required/>
            </td>
        </tr>
        <tr>
            <td>
                <label for="description">Description:</label>
            </td>
            <td>
                <textarea id="description" bind:value={updatedCurriculum.description} required></textarea>
            </td>
        </tr>
    </table>

    <CollapseContainer heading="Chapter Order">
        <div id="drag-container">
            {#each chaptersArray as chapter, index (chapter.id)}
                <div
                        id={chapter.id}
                        draggable="true"
                        on:dragstart={e => dragStartHandler(e, index)}
                        on:dragover={e => dragOverHandler(e, index)}
                        class:newChapterDragContainer={chapter.id === "new"}
                >
                    {index + 1}:
                    {chapter.name}
                </div>
            {/each}
        </div>
    </CollapseContainer>

    <div class="submit-buttons">
        <button type="submit" class="click-button" id="submit-button">Submit</button>
        <button type="button" class="click-button" id="cancel-button" on:click={() => window.history.back()}>Cancel
        </button>
    </div>
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
    textarea {
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

    #drag-container {
        display: flex;
        flex-direction: column;
    }

    #drag-container div {
        padding: 1rem;
        border: 1px solid #ccc;
        margin: 0.5rem 0;
        cursor: grab;
    }

    .submit-buttons {
        margin-top: 2rem;
    }
</style>