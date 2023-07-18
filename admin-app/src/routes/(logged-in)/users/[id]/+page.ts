import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/users/${params.id}`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting User")
	const data = await response.json();
	return {user: data};
}) satisfies PageLoad;