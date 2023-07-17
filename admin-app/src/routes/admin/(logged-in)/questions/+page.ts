import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/questions/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Questions")
	const data = await response.json();
	return {questions: data};
}) satisfies PageLoad;