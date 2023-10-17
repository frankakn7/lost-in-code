import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	console.log("Requesting Question")
	const response = await fetch(`${apiUrl}/questions/${params.id}/full`, {
		method: 'GET',
		credentials: "include"
	});
	const data = await response.json();

	console.log("Requesting Chapter")
	const chapterResponse = await fetch(`${apiUrl}/chapters/${data.chapter_id}/`, {
		method: 'GET',
		credentials: "include"
	});
	const chapterData = await chapterResponse.json();
	return {question: data, chapter: chapterData[0]};
}) satisfies PageLoad;