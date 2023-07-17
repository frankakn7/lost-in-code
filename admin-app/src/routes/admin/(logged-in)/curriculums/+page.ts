import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';


export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/curriculums/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Curriculums")
	// console.log(response)
	const data = await response.json();
	return {curriculums: data};
}) satisfies PageLoad;