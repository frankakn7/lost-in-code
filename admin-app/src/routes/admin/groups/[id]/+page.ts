import type { PageLoad } from './$types';

export const load = (({ params }) => {
    return {
        post: {
            title: `Title for ${params.id} goes here`,
            content: `Content for ${params.id} goes here`
        }
    };
}) satisfies PageLoad;