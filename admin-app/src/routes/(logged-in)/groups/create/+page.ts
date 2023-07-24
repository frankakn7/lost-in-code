import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/curriculums/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Curriculums")
	const data = await response.json();
	return {curriculums: data};
}) satisfies PageLoad;