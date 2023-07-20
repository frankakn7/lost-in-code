<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
</script>

<div id="app">
	<div id="sidebar">
		<h2 id="app-name">L.I.C. Admin</h2>
		<nav>
			<ul>
				<!-- <li><a href="/">Dashboard</a></li> -->
				<li><a href="/groups">Groups</a></li>
				<li><a href="/users">Users</a></li>
				<li><a href="/curriculums">Curriculums</a></li>
				<li><a href="/upload">Upload</a></li>
			</ul>
			<ul>
				<li><a href="/logout">Logout</a></li>
			</ul>
		</nav>
	</div>
	<main>
		<slot />
	</main>
</div>

<style>
	#app-name {
		margin-bottom: 0;
		width: 100%;
		text-align: center;
		color: var(--timberwolf);
		font-weight: bold;
		/* text-shadow: 1px 1px 2px black; */
	}

	#sidebar {
		height: 100%;
		width: 12rem;
		background-color: var(--yinmn-blue);
		position: fixed; /* Fixed Sidebar (stay in place on scroll) */
		z-index: 1; /* Stay on top */
		top: 0; /* Stay at the top */
		left: 0;
		overflow-x: hidden; /* Disable horizontal scroll */
		/* padding-top: 2rem; */
		display: flex;
		flex-direction: column;
	}

	nav {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	ul {
		list-style-type: none;
		padding: 0;
		padding-top: 1rem;
		padding-bottom: 1rem;
		margin: 0;
	}

	ul li {
		/* margin-bottom: 0.5rem;    */
	}

	ul li:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}

	ul a {
		padding: 1rem;
		text-decoration: none;
		color: var(--timberwolf);
		display: inline-block;
		width: 100%;
	}

	main {
		margin: 2rem;
		margin-left: 13rem; /* Same as the width of the sidebar */
		padding: 0px 10px;
	}

	#app {
		/* display: flex; */
	}

	:global(body) {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: var(--timberwolf);
	}

	:global(input) {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}

	:global(:root) {
		--moonstone: #0fa3b1ff;
		--timberwolf: rgb(247, 243, 240);
		--yinmn-blue: #3e536dff;
		--imperial-red: #e54b4bff;
		--pigment-green: #4aad52ff;

		--yinmn-blue-rgb: 62, 83, 109;

		/* $moonstone: rgba(15, 163, 177, 1);
		$timberwolf: rgba(228, 223, 218, 1);
		$yinmn-blue: rgba(62, 83, 109, 1);
		$imperial-red: rgba(229, 75, 75, 1);
		$pigment-green: rgba(74, 173, 82, 1); */
	}
</style>
