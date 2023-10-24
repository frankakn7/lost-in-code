<script lang="ts">
	import type { PageData } from './$types';
	import UserTable from '$lib/components/UserTable.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import hljs from 'highlight.js/lib/core';
    import json from 'highlight.js/lib/languages/json';
	import CollapseContainer from '$lib/components/CollapseContainer.svelte'; // choose a style


    hljs.registerLanguage('json', json);
	export let data: PageData;

	let user = data.user;
	let groups = data.groups;
	let gamestate = data.gamestate;

	let originalUser = { ...user };
	let editing: any = { username: false, email: false, password: false, group: false, role: false };
	let editedUser = { ...user };

	let showConfirm = false;
	let showConfirmGamestate = false;

    let jsonPreContainer: HTMLPreElement

    let gamestateOpen = false;

    $: jsonPreContainer ? jsonPreContainer.innerHTML = hljs.highlight(JSON.stringify(gamestate, null, 2), {language: "json"}).value : null, gamestateOpen


	function handleEdit(field: string) {
		editing[field] = true;
	}

	function handleCancel() {
		editedUser = { ...originalUser };
		editing = { username: false, email: false, password: false, group: false, role: false };
	}

	function handleSave() {
		console.log('Saving user:', editedUser);
		if (editedUser.group_id == 'null') {
			editedUser.group_id = null;
		}
		const apiUrl = import.meta.env.VITE_API_URL;
		fetch(`${apiUrl}/users/${user.id}`, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editedUser)
		})
			.then((response) => {
				if (!response.ok) {
					console.error('Network response was not ok');
				}
				response
					.json()
					.then((responseData) => {
						user = { ...editedUser };
						originalUser = { ...user };
						editing = { username: false, email: false, password: false, group: false, role: false };
					})
					.catch((error) => console.error(error));
			})
			.catch((error) =>
				console.error('There has been a problem with your fetch operation: ', error)
			);
	}

	function handleDelete() {
		const apiUrl = import.meta.env.VITE_API_URL;
		fetch(`${apiUrl}/users/${user.id}`, {
			method: 'DELETE',
			credentials: 'include'
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				console.log(`User with id ${user.id} has been deleted.`);
				goto('/users');
			})
			.catch((error) => {
				console.error('There has been a problem with your fetch operation: ', error);
			});
	}

	function handleDeleteGamestate() {
		const apiUrl = import.meta.env.VITE_API_URL;
		console.log("deeletiong")
		fetch(`${apiUrl}/gamestates/${user.id}`, {
			method: 'DELETE',
			credentials: 'include'
		})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					console.log(`Gamestate from user with id ${user.id} has been deleted.`);
					showConfirmGamestate = false;
					gamestate = {};
				})
				.catch((error) => {
					console.error('There has been a problem with your fetch operation: ', error);
				});
	}
</script>

{#if showConfirm}
	<ConfirmModal on:close={() => (showConfirm = false)} on:confirm={handleDelete}>
		Are you sure you want to delete the user '{user.username}' with id {user.id} ?
	</ConfirmModal>
{/if}

{#if showConfirmGamestate}
    <ConfirmModal on:close={() => (showConfirmGamestate = false)} on:confirm={handleDeleteGamestate}>
        Are you sure you want to delete the <b>gamestate</b> for the user '{user.username}' with id {user.id} ?
    </ConfirmModal>
{/if}

<div id="heading">
	<h1>User Info</h1>
	<button class="click-button delete-button" on:click={() => (showConfirm = true)}
		><i class="fa fa-trash-can" />
	</button>
</div>

<h2>Data</h2>
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
				<td>
					<button type="button" class="click-button" on:click={() => handleEdit('username')}
						><i class="fa fa-pencil" /></button
					>
				</td>
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
				<td>
					<button type="button" class="click-button" on:click={() => handleEdit('email')}
						><i class="fa fa-pencil" /></button
					>
				</td>
			</tr>
			<tr>
				<td>Password </td>
				<td>
					{#if editing.password}
						<input type="password" id="password" bind:value={editedUser.password} required />
					{:else}
						*********
					{/if}
				</td>
				<td>
					<button type="button" class="click-button" on:click={() => handleEdit('password')}
						><i class="fa fa-pencil" /></button
					>
				</td>
			</tr>
			<tr>
				<td> Group </td>
				<td>
					{#if editing.group}
						<select id="groupId" bind:value={editedUser.group_id} required>
							<option value="null">None</option>
							{#each groups as group (group.id)}
								<option value={group.id}>({group.id}) {group.name}</option>
							{/each}
						</select>
					{:else}
						{groups.find((group) => group.id == user.group_id)?.name ?? 'None'}
					{/if}
				</td>
				<td>
					<button type="button" class="click-button" on:click={() => handleEdit('group')}
						><i class="fa fa-pencil" /></button
					>
				</td>
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
				<td>
					<button type="button" class="click-button" on:click={() => handleEdit('role')}
						><i class="fa fa-pencil" /></button
					>
				</td>
			</tr>
		</table>
	</div>
	{#if Object.values(editing).includes(true)}
		<div id="button-container">
			<button type="submit" class="click-button" id="save-button">Save</button>
			<button type="button" class="click-button" id="cancel-button" on:click={handleCancel}
				>Cancel
			</button>
		</div>
	{/if}
</form>

{#if Object.keys(gamestate).length != 0}
	<CollapseContainer heading="Game State" bind:open={gamestateOpen}>
        <div id="gamestate-delete-button-container">
            <button class="click-button delete-button" on:click={() => (showConfirmGamestate = true)}
            ><i class="fa fa-trash-can" />
        </button>
        </div>
		<pre id="gamestate-json" >
            <code class="hljs" bind:this={jsonPreContainer}>

            </code>
        </pre>
	</CollapseContainer>
{/if}

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

	.delete-button {
		background-color: var(--imperial-red);
		padding: 0.5rem;
	}

	#gamestate-json {
		/*border: 2px solid var(--yinmn-blue);*/
        /*background-color: white;*/
	}

    #gamestate-delete-button-container {
        display: flex;
        justify-content: right;
        align-items: center;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        width: 100%;
    }
</style>
