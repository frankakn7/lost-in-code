import type { PageLoad } from './$types';

export const load = (async ({ params, fetch, url }: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;


    console.log("Requesting Question")
    const questionResponse = await fetch(`${apiUrl}/questions/${params.id}/full`, {
        method: 'GET',
        credentials: "include"
    });
    const questionData = await questionResponse.json();

    console.log("Requesting Specific Chapter")
    const chapterResponse = await fetch(`${apiUrl}/chapters/${questionData.chapter_id}`, {
        method: 'GET',
        credentials: "include"
    });
    const chapterData = await chapterResponse.json();


    console.log("Requesting Curriculum Chapters")
    const curriculumChaptersResponse = await fetch(`${apiUrl}/chapters/curriculum/${chapterData.curriculum_id}`, {
        method: 'GET',
        credentials: "include"
    });
    const curriculumChaptersData = await curriculumChaptersResponse.json();


    return {chapter: chapterData[0], question: questionData, chapters: curriculumChaptersData};
}) satisfies PageLoad;