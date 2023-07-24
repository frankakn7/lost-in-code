import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/groups/${params.id}/full`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Group")
	const data = await response.json();

	const curriculumResponse = await fetch(`${apiUrl}/curriculums/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Group")
	const curriculumData = await curriculumResponse.json();

	return {group: data, curriculums: curriculumData};
}) satisfies PageLoad;