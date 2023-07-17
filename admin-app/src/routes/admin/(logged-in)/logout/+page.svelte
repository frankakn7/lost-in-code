<script lang="ts">
	import { goto } from '$app/navigation';

	const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    let output = "";

	async function logout() {
		const apiUrl = import.meta.env.VITE_API_URL;
		const response = await fetch(`${apiUrl}/logout`, {
			method: 'POST',
			credentials: 'include'
		});

		if (response.ok) {
			// Navigate to the login page
            // output = "Redirecting to Login in 3 seconds ..."
            for(let i = 3; i >= 1; i--){
                output = `Redirecting to Login in ${i} seconds ...`
			    await sleep(1000);
            }
			goto('/admin/login');
		} else {
            output = "Logout Failed"
			console.error('Logout failed');
		}
	}
	logout();
</script>

<h1>You are being logged out</h1>
<p>{output}</p>
