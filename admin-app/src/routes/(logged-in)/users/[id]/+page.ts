import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }: any) => {
	const apiUrl = import.meta.env.VITE_API_URL;
	const userResponse = await fetch(`${apiUrl}/users/${params.id}`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting User")
	const userData = await userResponse.json();
	const gamestateResponse = await fetch(`${apiUrl}/gamestates/${params.id}`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Gamestate")
	let gamestateData;
	try{
		gamestateData = await gamestateResponse.json();
	}catch(e){
		gamestateData = null;
		console.log("No Gamestate Data")
	}
	const groupResponse = await fetch(`${apiUrl}/groups/`, {
		method: 'GET',
		credentials: "include"
	});
	console.log("Requesting Groups")
	const groupData = await groupResponse.json();
	return {user: userData,groups: groupData,gamestate: gamestateData};
}) satisfies PageLoad;