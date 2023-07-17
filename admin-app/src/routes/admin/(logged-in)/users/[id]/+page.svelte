<script lang="ts">
	import type { PageData } from './$types';
	import UserTable from '$lib/components/UserTable.svelte';

	export let data: PageData;

	let user = data.user;
	let originalUser = { ...user };
	let editing: any = { username: false, email: false, role: false };
	let editedUser = { ...user };

	function handleEdit(field: string) {
		editing[field] = true;
	}

	function handleCancel() {
		editedUser = { ...originalUser };
		editing = { username: false, email: false, role: false };
	}

	function handleSave() {
		// TODO: Implement your save logic here
		console.log('Saving user:', editedUser);
		user = { ...editedUser };
		originalUser = { ...user };
		editing = { username: false, email: false, role: false };
	}
</script>

<div id="heading">
    <h1>User Info</h1>
    <button class="click-button" id="delete-button"><i class="fa fa-trash-can"/></button>
</div>

<form on:submit|preventDefault={handleSave}>
	<div id="user-main">
		<table>
			<!-- ... other rows ... -->
			<tr>
				<td>Username</td>
				<td class="data-cell">
					{#if editing.username}
						<input class="text-input" bind:value={editedUser.username} />
					{:else}
						{user.username}
					{/if}
				</td>
				<td
					><button type="button" class="click-button" on:click={() => handleEdit('username')}
						><i class="fa fa-pencil" /></button
					></td
				>
			</tr>
			<tr>
				<td>Email</td>
				<td class="data-cell">
					{#if editing.email}
						<input class="text-input" bind:value={editedUser.email} />
					{:else}
						{user.email}
					{/if}
				</td>
				<td
					><button type="button" class="click-button" on:click={() => handleEdit('email')}
						><i class="fa fa-pencil" /></button
					></td
				>
			</tr>
			<tr>
				<td>Role</td>
				<td class="data-cell">
					{#if editing.role}
						<select class="text-input" bind:value={editedUser.role}>
							<option>ADMIN</option>
							<option>USER</option>
						</select>
					{:else}
						{user.role}
					{/if}
				</td>
				<td
					><button type="button" class="click-button" on:click={() => handleEdit('role')}
						><i class="fa fa-pencil" /></button
					></td
				>
			</tr>
		</table>
	</div>
	{#if editing.username || editing.email || editing.role}
		<div id="button-container">
			<button type="submit" class="click-button" id="save-button">Save</button>
			<button type="button" class="click-button" id="cancel-button" on:click={handleCancel}
				>Cancel</button
			>
		</div>
	{/if}
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

	#user-main {
		width: 100%;
	}

	td:last-child {
		display: flex;
		justify-content: center;
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

	.text-input {
		font-size: 1rem;
	}

	.data-cell {
		width: 35rem;
	}

	#save-button {
		background-color: var(--pigment-green);
        margin-right: 1rem;
	}

	#cancel-button {
		background-color: var(--imperial-red);
	}

    #heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #delete-button {
        background-color: var(--imperial-red);
        padding: 0.5rem;
    }
</style>
