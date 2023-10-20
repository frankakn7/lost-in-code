<script lang="ts">
    import Element from "$lib/classes/Element";
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import CollapseContainer from "$lib/components/CollapseContainer.svelte";
    import {SupportedProgLang} from "$lib/types/SupportedProgLang";

    export let elements: Element[] = [];

    export let prog_lang=SupportedProgLang.PHP;

    export let editing = false;

    if(!editing){
        elements = [];
        elements.push(new Element("", "", elements.length+1, false, []))
    }

    function addCodeBlock() {
        elements.push(new Element("", "", elements.length+1, false, []));
        elements = elements;
    }

    function removeCodeBlock(index: number) {
        elements.splice(index, 1);
        elements = elements;
    }

    let draggedItem = null;
    let draggedIndex = null;

    function dragStart(event, index) {
        draggedItem = elements[index];
        draggedIndex = index;
        event.dataTransfer.effectAllowed = "move";
    }

    function dragOver(event, index) {
        event.preventDefault();

        if (index !== draggedIndex) {
            // Remove the item from the old position and insert it at the new position
            elements.splice(draggedIndex, 1);
            elements.splice(index, 0, draggedItem);

            elements.forEach((element, index) => {
                element.correct_order_position = index +1;
            })

            // Update the dragged index
            draggedIndex = index;
            elements = elements
            console.log(elements)
        }
    }
</script>

<h2>Draggable Code Blocks</h2>
<table>
    <tr>
        <th></th>
        <th>
            Correct order position
        </th>
        <th>
            Code block content
        </th>
        <th></th>
    </tr>
    {#each elements as element,index}
        <tr draggable="true"
            on:dragstart={(e) => dragStart(e, index)}
            on:dragover={(e) => dragOver(e, index)}
        >
            <td class="drag-icon">
                <i class="fa fa-grip-vertical"></i>
            </td>
            <td>
                {element.correct_order_position}
            </td>
            <td>
                <textarea id={index} bind:value={element.content} type="text" required/>
            </td>
            <td>
                <button disabled='{elements.length === 1}' class="click-button" id="delete-button"
                        type="button"
                        on:click={() => removeCodeBlock(index)}
                >
                    <i class="fa fa-trash-can"></i></button>
            </td>
        </tr>
    {/each}
</table>

<div id="centered-button">
    <button class="click-button" id="add-button"
            on:click={addCodeBlock} type="button"><i class="fa fa-plus"/> Code Block
    </button>
</div>

<CollapseContainer heading="Preview">
    {#each elements as element, index}
        <CodeBlock code={elements[index].content} prog_lang={prog_lang}/>
    {/each}
</CollapseContainer>

<style>
    textarea {
        font-size: 1rem;
        width: 100%;
    }

    table {
        text-align: center;
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 2rem;
    }

    tr:nth-child(even) {
        background-color: rgba(var(--yinmn-blue-rgb), 0.2);
    }

    /*th:not(:last-child),*/
    td:not(:last-child) {
        border-right: 2px solid var(--yinmn-blue);
    }

    th,
    td {
        padding: 0.5rem;
    }

    input {
        font-size: 1rem;
        width: 50%;
        text-align: center;
    }

    #delete-button {
        background-color: var(--imperial-red);
        padding: 0.5rem;
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

    .click-button:disabled,
    .click-button:disabled:hover,
    #delete-button:disabled,
    #delete-button:disabled:hover {
        background-color: gray;
        cursor: unset;
        scale: 1;
    }

    #add-button {
        background-color: var(--pigment-green);
        margin-right: 1rem;
    }

    #centered-button {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .drag-icon {
        cursor: grab;
    }

    .drag-icon:active {
        cursor: grabbing;
    }
</style>