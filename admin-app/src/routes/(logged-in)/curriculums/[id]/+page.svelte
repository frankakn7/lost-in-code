<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

    export let data: PageData;

    let sortBy = { col: 'order_position', ascending: true };

	let chaptersArray = data.curriculum.chapters;

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

            chaptersArray = chaptersArray.sort(sort);
	};
</script>

<h1>Curriculum: {data.curriculum.name}</h1>
<p>{data.curriculum.description}</p>

<h2>Chapters</h2>

<table>
	<tr>
		<th on:click={() => sort('order_position')}>
			<div class="table-header">
				<div class="header-text">Nr.</div>
				{#if sortBy.col == 'order_position' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'order_position'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('name')}>
			<div class="table-header">
				<div class="header-text">Name</div>
				{#if sortBy.col == 'name' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'name'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('material')}>
			<div class="table-header">
				<div class="header-text">Material</div>
				{#if sortBy.col == 'material' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'material'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
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
	</tr>
	{#each chaptersArray as chapter}
		<tr on:click={() => goto(`/chapters/${chapter.id}`)}>
			<td>{chapter.order_position}</td>
			<td>{chapter.name}</td>
			{#if chapter.material}
				<td>{chapter.material.slice(0,50)}...</td>
			{:else}
				<td>-</td>
			{/if}
			<td>{chapter.id}</td>
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
