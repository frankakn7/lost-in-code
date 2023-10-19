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


    return {chapter: chapterData[0], chapterId: chapterId};
}) satisfies PageLoad;