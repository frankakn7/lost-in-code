import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/me`,{method: "GET", credentials: 'include'});
        if (response.status == 200) {
            const data = await response.json();
            if (!data.user) {
                throw new Error('User not logged in');
            }
            // If user is logged in, return the props you need for your component
            return { props: { user: data.user } };
        } else {
            throw new Error('Response not 200');
        }
    } catch (error) {
        console.log("User not logged in");
        throw redirect(307, '/admin/login');
        return {}
    }
}) satisfies LayoutLoad;
