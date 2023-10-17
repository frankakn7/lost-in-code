<script lang="ts">
    import MaterialPreview from "$lib/components/MaterialPreview.svelte";
    import CollapseContainer from "$lib/components/CollapseContainer.svelte";
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import Element from "$lib/classes/Element";
    import hljs from "highlight.js/lib/core";

    export let code = "";

    export let elements: Element[] = [];

    elements = [];

    const extractInputs = (rawCode: string) => {
        let regex = /###INPUT\|(.+?)\|(.+?)\|(.+?)###/g;
        let parts = rawCode.split(regex);
        let processedParts = [];

        let ids:string[] = [];

        for (let i = 0; i < parts.length; i += 4) {

            if (i + 1 < parts.length) {
                let id = parts[i + 1];
                ids.push(id);
                // let length = parts[i + 2];
                if(elements.find((element) => element.element_identifier === parts[i+1])){
                    continue;
                }else{
                    // let whitespace = parts[i + 3] === "true" ? "" : ' style="white-space: nowrap;"';
                    elements.push(new Element("",id,null,false,[""]))
                }
            }
        }
        elements = elements.filter((element) => ids.includes(element.element_identifier));
    }

    $: extractInputs(code), code

    function addCorrectAnswer(index) {
        elements[index].correct_answers!.push("");
        elements[index].correct_answers = elements[index].correct_answers;
    }

    function removeCorrectAnswer(elementIndex: number, answerIndex: number) {
        elements[elementIndex].correct_answers.splice(answerIndex, 1);
        elements[elementIndex].correct_answers = elements[elementIndex].correct_answers;
    }

    function addInputField(){
        let newId = elements.length ? elements[elements.length - 1].element_identifier : "i0";

        newId = "i" + (parseInt(newId?.slice(1)) + 1).toString();

        code += `###INPUT|${newId}|20|true###`;
    }
</script>

<div class="code-input-header">
    <h2>Code to display</h2>
    <button class="click-button"
            on:click={addInputField} type="button"><i class="fa fa-plus"/> Input
    </button>
</div>

<textarea id="code" bind:value={code}></textarea>

<CollapseContainer heading="Preview">
    <CodeBlock code={code}/>
</CollapseContainer>

<h2>Correct answers</h2>
<table>
    <tr>
        <th>
            Input id
        </th>
        <th>
            Correct answers
        </th>
    </tr>
    {#each elements as element,elementIndex}
        <tr>
            <td>
                {element.element_identifier}
            </td>
            <td class="element-correct-answers">
                {#each element.correct_answers as answer,answerIndex}
                    <div class="correct-answer">
                        <input id={`${elementIndex}_${answerIndex}`} bind:value={answer} type="text" required/>
                        <button disabled='{element.correct_answers.length === 1}' class="click-button"
                                id="delete-button" type="button"
                                on:click={() => removeCorrectAnswer(elementIndex,answerIndex)}
                        >
                            <i class="fa fa-trash-can"></i></button>
                    </div>
                {/each}
                <div id="centered-button">
                    <button class="click-button" id="add-button"
                            on:click={() => addCorrectAnswer(elementIndex)} type="button"><i class="fa fa-plus"/> Answer
                    </button>
                </div>
            </td>
        </tr>
    {/each}
</table>

<style>
    textarea {
        font-size: 1rem;
        width: 100%;
        height: 4rem;
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

    td,
    th{
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
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .correct-answer {
        width: 50%;
        padding: 0.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .element-correct-answers {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .code-input-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>