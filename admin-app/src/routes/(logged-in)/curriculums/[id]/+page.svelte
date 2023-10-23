<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import ConfirmModal from "$lib/components/ConfirmModal.svelte";
	import {onMount} from "svelte";

    export let data: PageData;

    let sortBy = { col: 'order_position', ascending: true };

	let chaptersArray = data.curriculum.chapters;

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

            chaptersArray = chaptersArray.sort(sort);
	};

	function handleDelete() {
		const apiUrl = import.meta.env.VITE_API_URL;
		fetch(`${apiUrl}/curriculums/${data.curriculum.id}`, {
			method: 'DELETE',
			credentials: "include"
		})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					console.log(`Curriculum with id ${data.curriculum.id} has been deleted.`);
					goto("/curriculums")
				})
				.catch((error) => {
					console.error('There has been a problem with your fetch operation: ', error);
				});
	}

	onMount(() => {
		sortBy.ascending = false;
		sort('order_position');
	})
</script>

{#if showConfirm}
	<ConfirmModal on:close={() => showConfirm = false} on:confirm={handleDelete}>
		Are you sure you want to delete the curriculum '{data.curriculum.name}' with the id {data.curriculum.id} ?
	</ConfirmModal>
{/if}

<div id="title-container">
	<h1>Curriculum: {data.curriculum.name} ({data.curriculum.prog_lang})</h1>
	<div class="button-container">
		<a class="click-button" id="edit-button" href={`/curriculums/${data.curriculum.id}/edit`}><i class="fa fa-pencil"/></a>
		<button class="click-button" id="delete-button" on:click={() => showConfirm = true}><i class="fa fa-trash-can"/>
		</button>
	</div>
</div>
<h2>Description</h2>
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

<div id="centered-button">
	<a href="/chapters/create?curriculumId={data.curriculum.id}" class="click-button" id="add-button"><i class="fa fa-plus" /> Add Chapter</a>
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

	#title-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	#centered-button{
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#edit-button:hover{
		font-size: 115%;
	}
</style>
