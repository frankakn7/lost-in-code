import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const response = await fetch(`${apiUrl}/chapters/${params.id}/full`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Chapters")
	// console.log(response)
	const data = await response.json();

	const curriculumResponse = await fetch(`${apiUrl}/curriculums/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Curriculum")
	const curriculumData = await curriculumResponse.json();
	return {chapter: data, curriculums: curriculumData};
}) satisfies PageLoad;
