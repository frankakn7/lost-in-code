import type { PageLoad } from './$types';

export const load = (async ({ fetch }: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/chapters/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Chapters")
	// console.log(response)
	const data = await response.json();
	return {chapters: data};
}) satisfies PageLoad;
