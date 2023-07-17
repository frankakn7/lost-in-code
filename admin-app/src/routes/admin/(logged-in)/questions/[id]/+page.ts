import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/questions/${params.id}/full`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Question")
	const data = await response.json();
	return {question: data};
}) satisfies PageLoad;