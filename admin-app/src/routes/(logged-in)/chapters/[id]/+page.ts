import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/chapters/${params.id}/full`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting")
	// console.log(response)
	const data = await response.json();
	return {chapter: data};
}) satisfies PageLoad;
