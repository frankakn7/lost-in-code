import type { PageLoad } from './$types';

export const load = (async ({ params, fetch, url }: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    console.log("Requesting Curriculums")
    const curriculumResponse = await fetch(`${apiUrl}/curriculums/`, {
        method: 'GET',
        credentials: "include"
    });
    const curriculumData = await curriculumResponse.json();

    const curriculumId = url.searchParams.get('curriculumId')

    console.log("Requesting Programming Language")
    const progLangResponse = await fetch(`${apiUrl}/curriculums/${curriculumId}/prog-lang`, {
        method: 'GET',
        credentials: "include"
    });
    const progLangData = await progLangResponse.json();


    return {curriculums: curriculumData, curriculumId: curriculumId, progLang: progLangData[0].prog_lang};
}) satisfies PageLoad;