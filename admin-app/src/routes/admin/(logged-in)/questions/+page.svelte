<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;

	let sortBy = { col: 'id', ascending: true };

	let questionsArray = data.questions;

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

<h1>Questions</h1>

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
		<tr on:click={() => goto(`/admin/questions/${question.id}`)}>
			<td>{question.id}</td>
			<td>{question.question_text ? question.question_text : "-"}</td>
			<td>{question.code_text ? `${question.code_text.slice(0,30)}...` : "-"}</td>
			<td>{question.type}</td>
			<td>{question.difficulty}</td>
		</tr>
	{/each}
</table>

<style>
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

	th:hover,
	tr:not(:first-child):hover {
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
</style>
