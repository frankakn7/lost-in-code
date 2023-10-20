<script lang="ts">
    import Element from "$lib/classes/Element";
    import CollapseContainer from "$lib/components/CollapseContainer.svelte";
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import {SupportedProgLang} from "$lib/types/SupportedProgLang";

    export let elements: Element[] = [];
    export let editing = false;

    export let prog_lang = SupportedProgLang.PHP

    export let code = "";

    if(!editing){
        elements = [];
        elements.push(new Element("","",null,false,[]))
    }

    function addChoice() {
        elements.push(new Element("","",null,false,[]));
        elements = elements;
    }

    function removeChoice(index:number) {
        elements.splice(index,1);
        elements = elements;
    }

</script>

<CollapseContainer heading="Optional code to display">

    <textarea id="code" bind:value={code}></textarea>
    <CollapseContainer heading="Preview">
        <CodeBlock code={code} prog_lang={prog_lang}/>
    </CollapseContainer>
</CollapseContainer>

<h2>Possible Answers</h2>
<table>
    <tr>
        <th>
            Choice content
        </th>
        <th>
            Is correct?
        </th>
    </tr>
    {#each elements as element,index}
        <tr>
            <td>
                <input id={index} bind:value={elements[index].content} type="text" required/>
            </td>
            <td>
                <input type="checkbox" bind:checked={elements[index].is_correct}>
            </td>
            <td>
                <button disabled='{elements.length === 1}' class="click-button" id="delete-button" type="button"
                        on:click={() => removeChoice(index)}
                >
                    <i class="fa fa-trash-can"></i></button>
            </td>
        </tr>
    {/each}
</table>

<div id="centered-button">
    <button class="click-button" id="add-button"
            on:click={addChoice} type="button"><i class="fa fa-plus"/> Choice
    </button>
</div>

<style>
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

    td,
    th {
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

    textarea {
        font-size: 1rem;
        width: 100%;
    }
</style>