import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/users/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Users")
	const data = await response.json();
	return {users: data};
}) satisfies PageLoad;