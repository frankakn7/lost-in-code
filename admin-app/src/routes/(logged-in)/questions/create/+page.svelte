<script lang="ts">

    import SingleInput from "$lib/components/questionCreation/SingleInput.svelte";
    import Question from "$lib/classes/Question";
    import {QuestionType} from "$lib/types/QuestionType";
    import {goto} from "$app/navigation";
    import type { PageData } from './$types';
    import Choice from "$lib/components/questionCreation/Choice.svelte";
    import SelectOne from "$lib/components/questionCreation/SelectOne.svelte";
    import DragDrop from "$lib/components/questionCreation/DragDrop.svelte";
    import Cloze from "$lib/components/questionCreation/Cloze.svelte";
    import {SupportedProgLang} from "$lib/types/SupportedProgLang";

    export let data: PageData;

    export let prog_lang = data.progLang;

    let newQuestion = new Question("", "", "", QuestionType.CHOICE, 1, [], data.chapterId);

    function handleSubmit() {
        const formData: Question = {
            ...newQuestion
        };
        console.log(formData);
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/questions/full`, {
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
                goto("/questions/" + responseData.insertId)
            }).catch(error => console.error(error));
        }).catch(error => console.error('There has been a problem with your fetch operation: ', error));


    }
</script>

<h1>Create Question</h1>

<form on:submit|preventDefault={handleSubmit}>
    <table>
        <tr>
            <td>
                <label for="type">Question Type:</label>
            </td>
            <td>
                <select id="type" bind:value={newQuestion.type} required>
                    {#each Object.values(QuestionType) as t }
                        <option value={t} selected={newQuestion.type === t}>{t}</option>
                    {/each}
                </select>
            </td>
        </tr>
        <tr>
            <td>
                <label for="question">Question:</label>
            </td>
            <td>
                <input id="question" bind:value={newQuestion.question_text} type="text" required/>
            </td>
        </tr>
        <tr>
            <td>
                <label for="difficulty">Difficulty:</label>
            </td>
            <td>
                <select id="difficulty" bind:value={newQuestion.difficulty} required>
                    {#each [1, 2, 3, 4, 5] as num}
                        <option value={num} selected={newQuestion.difficulty === num}>{num}</option>
                    {/each}
                </select>
            </td>
        </tr>
        <tr>
            <td>
                Chapter:
            </td>
            <td>
                {data.chapter.name} ({data.chapterId})
            </td>
        </tr>
    </table>

    {#if newQuestion.type === QuestionType.CHOICE}
        <Choice bind:elements={newQuestion.elements} bind:code={newQuestion.code_text} bind:prog_lang={prog_lang}/>
    {:else if newQuestion.type === QuestionType.SINGLE_INPUT}
        <SingleInput bind:code={newQuestion.code_text} bind:elements={newQuestion.elements} bind:prog_lang={prog_lang}/>
    {:else if newQuestion.type === QuestionType.CLOZE}
        <Cloze bind:code={newQuestion.code_text} bind:elements={newQuestion.elements} bind:prog_lang={prog_lang}/>
    {:else if newQuestion.type === QuestionType.DRAG_DROP}
        <DragDrop bind:elements={newQuestion.elements} bind:prog_lang={prog_lang}/>
    {:else if newQuestion.type === QuestionType.SELECT_ONE}
        <SelectOne bind:elements={newQuestion.elements} bind:prog_lang={prog_lang}/>
    {:else if newQuestion.type === QuestionType.CREATE}
        <!-- Your Create component here -->
    {/if}

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

    input {
        font-size: 1rem;
        width: 80%;
    }

    select {
        font-size: 1rem;
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
</style>