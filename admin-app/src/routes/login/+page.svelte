<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';

	async function handleSubmit() {
		const apiUrl = import.meta.env.VITE_API_URL;
		const response = await fetch(`${apiUrl}/login/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
            credentials: "include",
			body: JSON.stringify({ email, password })
		});
        // console.log(response)
		if (response.ok) {
			goto('/');
		} else {
			console.error('Login failed');
		}
	}
</script>

<div id="main-container">
	<!-- <div id="login-container"> -->
		<form on:submit|preventDefault={handleSubmit}>
            <h2>Login</h2>
			<div class="input-container">
				<i class="fa fa-envelope" aria-hidden="true" />
				<input type="email" bind:value={email} placeholder="Email" required />
			</div>
			<div class="input-container">
				<i class="fa fa-lock" aria-hidden="true" />
				<input type="password" bind:value={password} placeholder="Password" required />
			</div>
			<button id="login-button" type="submit">Login</button>
		</form>
	<!-- </div> -->
</div>

<style>
    h2 {
        margin: 0.5rem;
        text-align: center;
        font-size: 2rem;
    }

	#main-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* form {
		width: 100%;
	} */

	form {
		background-color: var(--timberwolf);
		padding: 1.5rem;
		width: 30%;
        height: 15rem;
		border-radius: 1rem;
		font-size: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        box-shadow: 5px 5px 10px rgba(10, 10, 10, 0.5);
	}

    form input{
		font-size: 1.3rem;
		border: 2px solid var(--yinmn-blue);
    }

	.input-container {
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

    #login-button {
        margin-top: 0.5rem;
        font-size: 1.2rem;
        cursor: pointer;
        background-color: var(--yinmn-blue);
        color: var(--timberwolf);
        border-style: none;
        border-radius: 0.2rem;
        padding: 0.3rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        transition: all 0.2s;
		width: 30%;
    }

    #login-button:hover {
        scale: 1.1;
        transition: all 0.2s;
    }
</style>
