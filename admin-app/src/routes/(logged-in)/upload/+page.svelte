<script lang="ts">
	import { goto } from '$app/navigation';
	import Error from '../+error.svelte';

	let file: any;
	let isDragging: boolean = false;
	let dropzoneText: string = "Drop a JSON file here, or click 'Choose File' to select one";

	function handleDrop(event: any) {
		event.preventDefault();
		isDragging = false;
		if (event.dataTransfer.items && event.dataTransfer.items[0]) {
			file = event.dataTransfer.items[0].getAsFile();
			dropzoneText = file.name;
		}
	}

	function handleDragOver(event: any) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleFileChange(event: any) {
		file = event.target.files[0];
		dropzoneText = file.name;
	}

	async function handleUpload() {
		if (!file) {
			alert('Please select a file to upload');
			return;
		}
		const reader = new FileReader();
		reader.onload = function (e) {
			const contents = e.target?.result;
			const apiUrl = import.meta.env.VITE_API_URL;
			const response = fetch(`${apiUrl}/curriculums/full`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: contents
			})
				.then((response: any) => {
					response
						.json()
						.then((data: any) => {
							goto(`/curriculums/${data.insertId}`);
						})
						.catch((error: any) => {
							console.error(error);
						});
				})
				.catch((error: any) => {
					console.error(error);
				});
		};
		reader.readAsText(file);
	}
</script>

<h1>Upload a Curriculum</h1>

<div id="upload-container">
	<div
		id="dropzone"
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		class:dragging={isDragging}
	>
		{dropzoneText}

		<label id="custom-file-button">
			<input type="file" accept=".json" on:change={handleFileChange} style="display: none;" />
			Choose File
		</label>
	</div>
	<button id="upload" on:click={handleUpload}>Upload</button>
</div>

<style>
	#custom-file-button {
		background-color: var(--yinmn-blue);
		color: var(--timberwolf);
		padding: 0.5rem;
		border-radius: 0.4rem;
		/* box-shadow: 2px 2px 2px gray; */
		transition: all 0.2s;
	}

	#custom-file-button:hover {
		cursor: pointer;
		scale: 1.1;
		/* transform: translateY(-3px); */
		/* box-shadow: 2px 5px 3px gray; */
		transition: all 0.2s;
	}

	#dropzone {
		margin: 20px 0;
		background-color: #d7d7d7;
		border: 2px dashed #aaa;
		border-radius: 0.5rem;
		padding: 20px;
		text-align: center;
		width: 80%;
		height: 10rem;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

	#dropzone.dragging {
		border: 2px solid var(--yinmn-blue);
		background-color: #bdbcbc;
	}

	#upload-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#upload {
		border-style: none;
		width: 40%;
		background-color: var(--pigment-green);
		color: var(--timberwolf);
		padding: 0.5rem;
		border-radius: 0.4rem;
		/* box-shadow: 2px 2px 2px gray; */
		transition: all 0.2s;
		font-size: 1.1rem;
	}

	#upload:hover {
		cursor: pointer;
		/* scale: 1.1; */
		/* transform: translateY(-3px); */
		/* box-shadow: 2px 5px 3px gray; */
		scale: 1.1;
		transition: all 0.2s;
	}
</style>
