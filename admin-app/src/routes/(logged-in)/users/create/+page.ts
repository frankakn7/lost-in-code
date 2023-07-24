import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/groups/`, {
        method: 'GET',
        credentials: "include"
    });
    console.log("Requesting Groups")
    const data = await response.json();
    return {groups: data};
}) satisfies PageLoad;