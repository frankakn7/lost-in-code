<script lang="ts">
    import MaterialPreview from "$lib/components/MaterialPreview.svelte";
    import CollapseContainer from "$lib/components/CollapseContainer.svelte";
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import Element from "$lib/classes/Element";

    // export let code = "";

    // export let correctAnswers: string[] = [""];

    export let elements: Element[] = [];

    elements = [];
    elements.push(new Element("", "", null, false, []))

    function addCodeBlock() {
        elements.push(new Element("", "", null, false, []));
        elements = elements;
    }

    function removeCodeBlock(index: number) {
        elements.splice(index, 1);
        elements = elements;
    }
</script>

<h2>Code block choices</h2>
<table>
    <tr>
        <th>
            Code block content
        </th>
        <th>
            Is correct?
        </th>
        <th></th>
    </tr>
    {#each elements as element,index}
        <tr>
            <td>
                <textarea id={index} bind:value={element.content} type="text" required/>
            </td>
            <td>
                <input type="checkbox" bind:checked={element.is_correct}>
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
            on:click={addCodeBlock} type="button"><i class="fa fa-plus"/> Code Block Choice
    </button>
</div>

<CollapseContainer heading="Preview">
    {#each elements as element, index}
        <CodeBlock code={elements[index].content}/>
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
</style>