import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log("Requesting Curriculum")
    const response = await fetch(`${apiUrl}/curriculums/${params.id}/full`, {
        method: 'GET',
        credentials: "include"
    });
    // console.log(response)
    const data = await response.json();

    console.log("Requesting Chapters")
    const chaptersResponse = await fetch(`${apiUrl}/chapters/curriculum/${params.id}`, {
        method: 'GET',
        credentials: 'include',
    });
    const chaptersData = await chaptersResponse.json();
    return {curriculum: data, chapters: chaptersData};
}) satisfies PageLoad;