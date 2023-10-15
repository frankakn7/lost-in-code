<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import MaterialPreview from "$lib/components/MaterialPreview.svelte";

	export let data: PageData;

	let sortBy = { col: 'id', ascending: true };

	let questionsArray = data.chapter.questions;

	let materialOpen = false;

	let curriculums = data.curriculums

	let currentCurriculum = curriculums.find(curriculum => curriculum.id == data.chapter.curriculum_id);

	$: if (data.chapter.curriculum_id) {
		currentCurriculum = curriculums.find(curriculum => curriculum.id == data.chapter.curriculum_id);
	}

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

		questionsArray = questionsArray.sort(sort);
	};
</script>

<h1>Chapter: {data.chapter.name}</h1>
<!--<h2>Material</h2>-->
<!--<p>{data.chapter.material}</p>-->
<h2>Info</h2>
<table class="info-table">
	<tr>
		<td>
			Name:
		</td>
		<td>
			{data.chapter.name}
		</td>
	</tr>
	<tr>
		<td>
			Curriculum:
		</td>
		<td>
			<a href="/curriculums/{currentCurriculum.id}">{currentCurriculum.name} ({currentCurriculum.id})</a>
		</td>
	</tr>
	<tr>
		<td>
			Order position:
		</td>
		<td>
			{data.chapter.order_position}
		</td>
	</tr>
</table>
<div class="preview-container">
	<button type="button" class="collapse-button" on:click={() => materialOpen = !materialOpen}>
		<h2>Material</h2>
		{#if materialOpen}
			<h2><i class="fa fa-angle-down"/></h2>
		{:else}
			<h2><i class="fa fa-angle-up"/></h2>
		{/if}
	</button>

	{#if materialOpen}
		<div class="preview">
			<!--{material}-->
			<!--            <CodeBlock code={material}/>-->
			<MaterialPreview text={data.chapter.material}/>
		</div>
	{/if}
</div>
<h2>Questions</h2>
<table class="question-table">
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
		<th on:click={() => sort('question_text')}>
			<div class="table-header">
				<div class="header-text">Question Text</div>
				{#if sortBy.col == 'question_text' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'question_text'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('code_text')}>
			<div class="table-header">
				<div class="header-text">Code Text</div>
				{#if sortBy.col == 'code_text' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'code_text'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('type')}>
			<div class="table-header">
				<div class="header-text">Type</div>
				{#if sortBy.col == 'type' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'type'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
        <th on:click={() => sort('difficulty')}>
			<div class="table-header">
				<div class="header-text">Difficulty</div>
				{#if sortBy.col == 'difficulty' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'difficulty'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
	</tr>
	{#each questionsArray as question}
		<tr on:click={() => goto(`/questions/${question.id}`)}>
			<td>{question.id}</td>
			<td>{question.question_text ?? "-"}</td>
			<td>{question.code_text ? `${question.code_text.slice(0,30)}...` : "-"}</td>
			<td>{question.type}</td>
			<td>{question.difficulty}</td>
		</tr>
	{/each}
</table>
<div id="centered-button">
	<a href="/questions/create?chapterId={data.chapter.id}" class="click-button" id="add-button"><i class="fa fa-plus" /> Add Question</a>
</div>
<style>

	.info-table {
		text-align: left;
	}

	/*.info-table tr:hover {*/
	/*	pointer-events: none;*/
	/*	!*background-color: inherit;*!*/
	/*}*/

	table {
		text-align: center;
		border-collapse: collapse;
		width: 100%;
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

	.question-table th:hover,
	.question-table tr:not(:first-child):hover {
		cursor: pointer;
		background-color: rgba(var(--yinmn-blue-rgb), 0.4);
	}

	td:not(:last-child),
	th:not(:last-child) {
		border-right: 2px solid var(--yinmn-blue);
	}

	td,
	th {
		padding: 0.5rem;
	}

	.preview-container {
		/*border: 2px solid var(--yinmn-blue);*/
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		/*align-items: center;*/
	}

	.collapse-button {
		all: unset;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		padding: 0.5rem;
		padding-left: 0;
		box-sizing: border-box;
	}

	.collapse-button h2 {
		margin: 0;
	}

	.collapse-button:hover {
		background-color: rgba(1, 1, 1, 0.1);
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

	#add-button {
		background-color: var(--pigment-green);
		margin-right: 1rem;
	}

	#centered-button a {
		text-decoration: none;
	}

	#centered-button{
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
