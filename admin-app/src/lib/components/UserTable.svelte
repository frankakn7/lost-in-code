<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from './Modal.svelte';
	import UserModal from './UserModal.svelte';

	export let users: any[] = [];

	let sortBy = { col: 'id', ascending: true };

	let userArray = users;

	let showUserModal = true;

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

		userArray = userArray.sort(sort);
	};

	function handleClose() {
		showUserModal = false;
	}
</script>

<!-- {#if showUserModal}
    <UserModal on:close={handleClose} user={}/>
{/if} -->

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
		<th on:click={() => sort('username')}>
			<div class="table-header">
				<div class="header-text">Username</div>
				{#if sortBy.col == 'username' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'username'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('email')}>
			<div class="table-header">
				<div class="header-text">Email</div>
				{#if sortBy.col == 'email' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'email'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
		<th on:click={() => sort('role')}>
			<div class="table-header">
				<div class="header-text">Role</div>
				{#if sortBy.col == 'role' && !sortBy.ascending}
					<i class="fa fa-arrow-up" />
				{:else if sortBy.col === 'role'}
					<i class="fa fa-arrow-down" />
				{:else}
					<i class="fa fa-arrow-down" style="visibility: hidden;" />
				{/if}
			</div>
		</th>
	</tr>
	{#each userArray as user}
		<tr on:click={() => goto(`/admin/users/${user.id}`)}>
		<!-- <tr on:click={() => showUserModal = true}> -->
			<td>{user.id}</td>
			<td>{user.username}</td>
			<td>{user.email}</td>
			<td>{user.role}</td>
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
