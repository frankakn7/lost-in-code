<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import UserTable from '$lib/components/UserTable.svelte';
	export let data: PageData;

	let sortBy = { col: 'id', ascending: true };

	let userArray = data.users;
</script>

<h1>Users</h1>
<UserTable users={userArray} />