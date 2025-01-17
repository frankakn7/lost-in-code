<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import CollapseContainer from '$lib/components/CollapseContainer.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	export let data: PageData;

	let sortBy = { col: 'id', ascending: true };

	let elementsArray = data.question.elements;

	let showConfirm = false;

	let sort = (column: string) => {
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending;
		} else {
			sortBy.col = column;
			sortBy.ascending = true;
		}

		// Modifier to sorting function for ascending or descending
		let sortModifier = sortBy.ascending ? 1 : -1;

		let sort = (a: any, b: any) =>
			a[column] < b[column] ? -1 * sortModifier : a[column] > b[column] ? 1 * sortModifier : 0;

		elementsArray = elementsArray.sort(sort);
	};

	function handleDelete() {
		const apiUrl = import.meta.env.VITE_API_URL;
		fetch(`${apiUrl}/questions/${data.question.id}`, {
			method: 'DELETE',
			credentials: 'include'
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				console.log(`Question with id ${data.question.id} has been deleted.`);
				goto(`/chapters/${data.question.chapter_id}`);
			})
			.catch((error) => {
				console.error('There has been a problem with your fetch operation: ', error);
			});
	}
</script>

{#if showConfirm}
	<ConfirmModal on:close={() => (showConfirm = false)} on:confirm={handleDelete}>
		Are you sure you want to delete the Question '{data.question.question_text}' with the id {data
			.question.id} ?
	</ConfirmModal>
{/if}

<div id="title-container">
	<h1>Question</h1>
	<div class="button-container">
		<a class="click-button" id="edit-button" href={`/questions/${data.question.id}/edit`}
			><i class="fa fa-pencil" /></a
		>
		<button class="click-button" id="delete-button" on:click={() => (showConfirm = true)}
			><i class="fa fa-trash-can" />
		</button>
	</div>
</div>

<h2>Details</h2>

<table id="details-table">
	<tr>
		<td>ID</td>
		<td>{data.question.id}</td>
	</tr>
	<tr>
		<td>Question Text</td>
		<td>{data.question.question_text ? data.question.question_text : '-'}</td>
	</tr>
	<tr>
		<td>Code Text</td>
		<td>{data.question.code_text ? data.question.code_text : '-'}</td>
	</tr>
	<tr>
		<td>Hint</td>
		<td>{data.question.hint ? data.question.hint : '-'}</td>
	</tr>
	<tr>
		<td>Type</td>
		<td>{data.question.type}</td>
	</tr>
	<tr>
		<td>Difficulty</td>
		<td>{data.question.difficulty}</td>
	</tr>
	<tr>
		<td>Chapter</td>
		<td>
			<a href="/chapters/{data.chapter.id}">{data.chapter.name} ({data.chapter.id})</a>
		</td>
	</tr>
</table>

{#if data.question.code_text}
	<CollapseContainer heading="Code Preview">
		<CodeBlock code={data.question.code_text} prog_lang={data.progLang} />
	</CollapseContainer>
{/if}

<h2>Elements</h2>

<table>
	<tr>
		<th on:click={() => sort('id')}>
			<div class="table-header">
				<div class="header-text">ID</div>
				{#if sortBy.col == 'id' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'id'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('content')}>
			<div class="table-header">
				<div class="header-text">Content</div>
				{#if sortBy.col == 'content' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'content'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('element_identifier')}>
			<div class="table-header">
				<div class="header-text">Element Identifier</div>
				{#if sortBy.col == 'element_identifier' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'element_identifier'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('correct_order_position')}>
			<div class="table-header">
				<div class="header-text">Correct Order Position</div>
				{#if sortBy.col == 'correct_order_position' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'correct_order_position'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('is_correct')}>
			<div class="table-header">
				<div class="header-text">Is Correct</div>
				{#if sortBy.col == 'is_correct' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'is_correct'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('correct_answers')}>
			<div class="table-header">
				<div class="header-text">Correct Answers</div>
				{#if sortBy.col == 'correct_answers' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'correct_answers'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
	</tr>
	{#each elementsArray as element}
		<!-- <tr on:click={() => goto(`/elements/${element.id}`)}> -->
		<tr>
			<td>{element.id}</td>
			<td>{element.content?.length ? element.content : '-'}</td>
			<td>{element.element_identifier?.length ? element.element_identifier : '-'}</td>
			<td>{element.correct_order_position ?? '-'}</td>
			<td>{element.is_correct ?? '-'}</td>
			<td class="correct-answers">
				{!element.correct_answers.length ? '-' : ''}
				{#each element.correct_answers as answer}
					<div>{answer}</div>
				{/each}
			</td>
		</tr>
	{/each}
</table>

<style>
	table {
		text-align: center;
		border-collapse: collapse;
		width: 100%;
		/* margin-bottom: 2rem; */
	}

	.table-header {
		/* display: inline; */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-text {
		text-align: center;
		flex-grow: 1;
		/* display: flex; */
		/* justify-content: space-between; */
		/* float: right; */
	}

	th {
		border-bottom: 2px solid var(--yinmn-blue);
	}

	tr:nth-child(even) {
		background-color: rgba(var(--yinmn-blue-rgb), 0.2);
	}

	/* th:hover,
    tr:not(:first-child):hover {
        cursor: pointer;
        background-color: rgba(var(--yinmn-blue-rgb), 0.4);
    } */

	td:not(:last-child),
	th:not(:last-child) {
		border-right: 2px solid var(--yinmn-blue);
	}

	td,
	th {
		padding: 0.5rem;
	}

	.correct-answers {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#details-table {
		text-align: left;
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

	#title-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	#edit-button:hover {
		font-size: 115%;
	}
</style>
