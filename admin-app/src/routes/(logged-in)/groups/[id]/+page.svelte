<script lang="ts">
    import type { PageData } from './$types';
	import UserTable from '$lib/components/UserTable.svelte';

    export let data: PageData;

    let userArray = data.group.users;
</script>

<h1>{data.group.name}</h1>
<div>{@html data.group.description}</div>

<h2>Users</h2>
<UserTable users={userArray} />