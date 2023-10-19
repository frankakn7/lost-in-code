import type { PageLoad } from './$types';

export const load = (async ({ params, fetch, url }: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    console.log("Requesting Curriculums")
    const curriculumResponse = await fetch(`${apiUrl}/curriculums/`, {
        method: 'GET',
        credentials: "include"
    });
    const curriculumData = await curriculumResponse.json();

    console.log("Request all chapters")
    //Rquest chapters using apiUrl/chapters/curriculum/[id] here

    const curriculumId = url.searchParams.get('curriculumId')

    return {curriculums: curriculumData, curriculumId: curriculumId};
}) satisfies PageLoad;