<script lang="ts">
    import type {PageData} from './$types';
    import {goto} from "$app/navigation";
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import MaterialPreview from "$lib/components/MaterialPreview.svelte";
    import CollapseContainer from "$lib/components/CollapseContainer.svelte";

    export let data: PageData;

    console.log(data)

    //order position - 1 = index in chapters array
    const newChapter = {id: "new", name: "New Chapter", material: "", order_position: 0}

    // let name = '';
    // let material = '';
    // let curriculumId = data.curriculumId ? +data.curriculumId : "null";
    let curriculumId = data.curriculumId ? +data.curriculumId : "null";
    const curriculums = data.curriculums;

    let chapterOrderOpen = false

    console.log(curriculumId)

    let chapters = []; // Assuming chapters are stored in an array

    function updateNewChapterInArray(newChapter) {
        console.log("update chapter")
        chapters[newChapter.order_position - 1] = newChapter;
    }

    function fetchAndUpdateChapters(curriculumId) {
        fetchChapters(curriculumId).then(value => {
            if (value) {
                chapters = value;
                chapters.sort((a, b) => a.order_position - b.order_position); // Sort chapters by order_position
                newChapter.order_position = chapters.length + 1; // Set newChapter's order_position
                chapters.push(newChapter); // Add newChapter at the end
                console.log(chapters)
            }
        }).catch(errror => console.error(errror));
    }

    $: if (curriculumId !== 'null') {
        fetchAndUpdateChapters(curriculumId)
    }

    $: updateNewChapterInArray(newChapter)

    async function fetchChapters(id: string | number) {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/chapters/curriculum/${id}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch chapters")
        }
    }

    function updateChapterOrderPosition(chapter){
        const formData = {
            // name: chapter.name,
            // material: chapter.material,
            // curriculum_id: chapter.curriculum_id,
            // order_position: chapter.order_position,
            ...chapter
        };
        console.log(formData);
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/chapters/${chapter.id}`, {
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
            return
            // response.json().then((responseData) => goto("/chapters/" + responseData.insertId)).catch(error => console.error(error));
        }).catch(error => console.error('There has been a problem with your fetch operation: ', error));
    }

    function handleSubmit() {
        const formData = {
            name: newChapter.name,
            material: newChapter.material,
            curriculum_id: curriculumId === 'null' ? null : curriculumId,
            order_position: newChapter.order_position
        };
        console.log(formData);
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/chapters/`, {
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
            response.json().then((responseData) => {
                for(let chapter of chapters){
                    if(chapter.id === "new"){
                        continue;
                    }
                    updateChapterOrderPosition(chapter);
                }
                goto("/chapters/" + responseData.insertId)
            }).catch(error => console.error(error));
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
            [chapters[draggedIndex], chapters[index]] = [chapters[index], chapters[draggedIndex]];
            for (let i in chapters) {
                chapters[i].order_position = +i + 1;
                if (chapters[i].id == "new") {
                    newChapter.order_position = +i + 1;
                }
            }
            draggedIndex = index;
        }
    }

    function dragEndHandler() {
        // Maybe send the reordered chapters back to the server here
    }
</script>

<h1>Add Chapter</h1>
<form on:submit|preventDefault={handleSubmit}>
    <table>
        <tr>
            <td>
                <label for="name">Name:</label>
            </td>
            <td>
                <input id="name" bind:value={newChapter.name} type="text" required/>
            </td>
        </tr>
        <tr>
            <td>
                <label for="curriculumId">Curriculum ID:</label>
            </td>
            <td>
                <select id="curriculumId" bind:value={curriculumId} required>
<!--                    <option value="null">None</option> &lt;!&ndash;selected={curriculumId === 'null'}&ndash;&gt;-->
                    {#each curriculums as curriculum }
                        <option value={curriculum.id}><!--selected={+curriculumId === +curriculum.id}>-->
                            ({curriculum.id}) {curriculum.name}
                        </option>
                    {/each}
                </select>
            </td>
        </tr>
        <tr>
            <td>
                Order position:
            </td>
            <td>
                {newChapter.order_position}
            </td>
        </tr>
    </table>
    <CollapseContainer heading="Chapter Order">
        <div id="drag-container">
            {#each chapters as chapter, index (chapter.id)}
                <div
                        id={chapter.id}
                        draggable="true"
                        on:dragstart={e => dragStartHandler(e, index)}
                        on:dragover={e => dragOverHandler(e, index)}
                        on:dragend={dragEndHandler}
                        class:newChapterDragContainer={chapter.id === "new"}
                >
                    {index + 1}:
                    {chapter.name}
                </div>
            {/each}
        </div>
    </CollapseContainer>

    <h2>Material</h2>

    <textarea id="description" bind:value={newChapter.material} required></textarea>

    <div class="preview-container">
        <CollapseContainer heading="Preview">
            <div class="preview">
                <!--{material}-->
                <!--            <CodeBlock code={material}/>-->
                <MaterialPreview text={newChapter.material}/>
            </div>
        </CollapseContainer>
    </div>

    <div class="button-container">
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
    select {
        font-size: 1rem;
        width: 80%;
    }

    textarea {
        font-size: 1rem;
        width: 100%;
    }

    .preview {
        margin-top: 1rem;
        width: 90%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .preview-container {
        /*border: 2px solid var(--yinmn-blue);*/
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /*align-items: center;*/
    }

    .button-container {
        margin-top: 2rem;
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

    .newChapterDragContainer {
        font-weight: bold;
    }
</style>