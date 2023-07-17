import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load = (async ({ params }: any) => {
    throw redirect(307, '/admin');
}) satisfies PageLoad;
