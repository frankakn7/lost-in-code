<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;

	let sortBy = { col: 'id', ascending: true };

	let curriculumArray = data.curriculums;

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

		curriculumArray = curriculumArray.sort(sort);
	};
</script>

<h1>Curriculums</h1>
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
		<th on:click={() => sort('description')}>
			<div class="table-header">
				<div class="header-text">Description</div>
				{#if sortBy.col == 'description' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'description'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('prog_lang')}>
			<div class="table-header">
				<div class="header-text">Programming Language</div>
				{#if sortBy.col == 'prog_lang' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'prog_lang'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
	</tr>
	{#each curriculumArray as curriculum}
		<tr on:click={() => goto(`/curriculums/${curriculum.id}`)}>
			<td>{curriculum.id}</td>
			<td>{curriculum.name}</td>
			<td>{curriculum.description}</td>
			<td>{curriculum.prog_lang}</td>
		</tr>
	{/each}
</table>

<div id="centered-button">
	<a href="/curriculums/create" class="click-button" id="add-button"><i class="fa fa-plus" /> Add Curriculum</a>
</div>

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

	a {
		text-decoration: none;
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
		font-size: 1.1rem;
		/* box-shadow: 4px 4px 2px gray; */
		transition: all 0.2s;
	}

	.click-button:active {
		scale: 0.9;
		font-size: 1rem;
		transition: all 0.2s;
	}

	#add-button {
		background-color: var(--pigment-green);
		margin-right: 1rem;
	}

	#centered-button{
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
