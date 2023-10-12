<script lang="ts">
    import type {PageData} from './$types';
    import {afterNavigate, goto} from "$app/navigation";
    import {base} from "$app/paths";

    export let data: PageData;

    let username = '';
    let email = '';
    let password = '';
    let passwordConfirm = '';
    let group_id = 'null';
    let role = 'USER';
    const groups = data.groups;

    let passwordMismatch = false;

    // let previousPage : string = base ;
    //
    // afterNavigate(({from}) => {
    //     previousPage = from?.url.pathname || previousPage
    // })

    function handleSubmit() {
        if (password !== passwordConfirm) {
            passwordMismatch = true;
            // alert("Passwords do not match!");
            return;
        }

        const formData = {username, email, password, group_id: group_id === 'null' ? null : group_id, role};
        console.log(formData);
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/users/`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then((response) => {


            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            response.json().then((responseData) => goto("/users/" + responseData.insertId)).catch(error => console.error(error));
        }).catch(error => console.error('There has been a problem with your fetch operation: ', error));
    }
</script>

<h1>Add User</h1>
<form on:submit|preventDefault={handleSubmit}>
    <table>
        <tr>
            <td>
                <label for="name">Username</label>
            </td>
            <td>
                <input id="name" bind:value={username} type="text" required/>
            </td>
        </tr>
        <tr>
            <td>
                <label for="email">Email</label>
            </td>
            <td>
                <input type="email" id="email" bind:value={email} required />
            </td>
        </tr>
        <tr>
            <td>
                <label for="password">Password</label>
            </td>
            <td>
                <input type="password" id="password" bind:value={password} required />
            </td>
        </tr><tr>
            <td>
                <label for="password-confirm">Confirm Password</label>
            </td>
            <td>
                <input type="password" id="password-confirm" bind:value={passwordConfirm} class="{passwordMismatch ? 'mismatch' : ''}" required />
            </td>
        </tr>
        <tr>
            <td>
                <label for="groupId">Group</label>
            </td>
            <td>
                <select id="groupId" bind:value={group_id} required>
                    <option value="null" selected>None</option>
                    {#each groups as group (group.id)}
                        <option value={group.id}>({group.id}) {group.name}</option>
                    {/each}
                </select>
            </td>
        </tr>
        <tr>
            <td>
                <label for="role">Role</label>
            </td>
            <td>
                <select id="role" bind:value={role} required>
                    <option value="USER" selected>USER</option>
                    <option value="ADMIN" selected>ADMIN</option>
                </select>
            </td>
        </tr>
    </table>
    <button type="submit" class="click-button" id="submit-button">Submit</button>
    <button type="button" class="click-button" id="cancel-button" on:click={() => window.history.back()}>Cancel</button>
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

    input,
    select {
        font-size: 1rem;
        width: 80%;
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

    #submit-button {
        background-color: var(--pigment-green);
        margin-right: 1rem;
    }

    #cancel-button {
        background-color: var(--imperial-red);
    }

    .mismatch {
        border: 2px solid var(--imperial-red);
    }

</style>