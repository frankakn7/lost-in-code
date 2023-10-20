import type { PageLoad } from './$types';

export const load = (async ({ params, fetch, url }: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const chapterId = url.searchParams.get('chapterId')

    console.log("Requesting Chapter")
    const chapterResponse = await fetch(`${apiUrl}/chapters/${chapterId}`, {
        method: 'GET',
        credentials: "include"
    });
    const chapterData = await chapterResponse.json();

    console.log("Requesting Programming Language")
    const progLangResponse = await fetch(`${apiUrl}/curriculums/${chapterData[0].curriculum_id}/prog-lang`, {
        method: 'GET',
        credentials: "include"
    });
    const progLangData = await progLangResponse.json();

    return {chapter: chapterData[0], chapterId: chapterId, progLang: progLangData[0].prog_lang};
}) satisfies PageLoad;