<script>
	import { page } from '$app/stores';
</script>

<div>
	<h1>Sadly Something Went Wrong</h1>
	<h1>{$page.status}: {$page.error?.message}</h1>
</div>

<style>
	div {
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		font-family: monospace;
		color: var(--imperial-red);
		font-size: larger;
	}
</style>
