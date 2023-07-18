<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;

	let sortBy = { col: 'id', ascending: true };

	let elementsArray = data.question.elements;

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
</script>

<h1>Question</h1>

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
</table>

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
			<td>{element.content ?? '-'}</td>
			<td>{element.element_identifier ?? '-'}</td>
			<td>{element.correct_order_position ?? '-'}</td>
			<td>{element.is_correct ?? '-'}</td>
            <td class="correct-answers">
                {!element.correct_answers ? '-' : ''}
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
</style>
