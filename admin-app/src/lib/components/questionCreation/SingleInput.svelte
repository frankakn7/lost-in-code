<script lang="ts">
    import MaterialPreview from "$lib/components/MaterialPreview.svelte";
    import CollapseContainer from "$lib/components/CollapseContainer.svelte";
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import Element from "$lib/classes/Element";

    export let code = "";

    // export let correctAnswers: string[] = [""];

    export let elements: Element[] = [];

    export let editing = false;

    if(!editing){
        elements = [];
        elements.push(new Element("","i1",null,null,[""]))
    }

    function addCorrectAnswer() {
        elements[0].correct_answers!.push("");
        elements[0].correct_answers = elements[0].correct_answers;
    }

    function removeCorrectAnswer(index:number) {
        elements[0].correct_answers!.splice(index,1);
        elements[0].correct_answers = elements[0].correct_answers;
    }
</script>

<h2>Code to display</h2>

<textarea id="code" bind:value={code}></textarea>

<CollapseContainer heading="Preview">
    <CodeBlock code={code}/>
</CollapseContainer>

<h2>Correct answers</h2>
<table>
    {#each elements[0].correct_answers as answer,index}
        <tr>
            <td>
                <input id={index} bind:value={elements[0].correct_answers[index]} type="text" required/>
            </td>
            <td>
                <button disabled='{elements[0].correct_answers.length === 1}' class="click-button" id="delete-button" type="button"
                        on:click={() => removeCorrectAnswer(index)}
                >
                    <i class="fa fa-trash-can"></i></button>
            </td>
        </tr>
    {/each}
</table>

<div id="centered-button">
    <button class="click-button" id="add-button"
            on:click={addCorrectAnswer} type="button"><i class="fa fa-plus"/> Correct
        Answer
    </button>
</div>

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

    td:not(:last-child) {
        border-right: 2px solid var(--yinmn-blue);
    }

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
    #delete-button:disabled:hover{
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