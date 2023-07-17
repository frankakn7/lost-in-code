<script>
	import { page } from '$app/stores';
</script>

<div>
	<h1>Something Went Wrong</h1>
	<p>{$page.error?.message}</p>
</div>

<style>
	h1,
	p {
		color: var(--imperial-red);
	}

	div {
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
</style>
