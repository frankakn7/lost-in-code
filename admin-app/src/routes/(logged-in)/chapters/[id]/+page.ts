import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	console.log("Requesting Chapter")
	const response = await fetch(`${apiUrl}/chapters/${params.id}/full`, {
		method: 'GET',
		credentials: "include"
	});
	// console.log(response)
	const data = await response.json();

	console.log("Requesting Curriculum")
	const curriculumResponse = await fetch(`${apiUrl}/curriculums/`, {
		method: 'GET',
		credentials: "include"
	});
	const curriculumData = await curriculumResponse.json();

	console.log("Requesting Chapters")
	const curriculumChaptersResponse = await fetch(`${apiUrl}/chapters/curriculum/${data.curriculum_id}`, {
		method: 'GET',
		credentials: "include"
	});
	const chaptersData = await curriculumChaptersResponse.json();
	return {chapter: data, curriculums: curriculumData, chapters: chaptersData};
}) satisfies PageLoad;
