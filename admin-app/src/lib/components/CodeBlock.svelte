<script lang="ts">
    import { onMount } from 'svelte';
    import "svelte-highlight/styles/night-owl.css";
    import hljs from 'highlight.js/lib/core';
    import php from 'highlight.js/lib/languages/php';
    // import java from 'highlight.js/lib/languages/java';

    hljs.registerLanguage('php', php);
    // hljs.registerLanguage('java',java)

    export let code: string;
    let preElement: HTMLPreElement;

    onMount(() => {
        preElement.innerHTML = hljs.highlight(code, { language: "php" }).value;
    });

    $: if (preElement) {
        preElement.innerHTML = hljs.highlight(code, { language: "php" }).value;
    }
</script>

<pre bind:this={preElement} id="highlighted-code">
</pre>

<style>
    #highlighted-code {
        font-family: "forwardRegular";
        letter-spacing: 2px;
        font-size: 0.75rem;
        line-height: 2;
        width: 90%; /* Assuming this.scene.cameras.main.displayWidth is 100vw */

        background-color: #1c1d21;
        color: #c0c5ce;
        padding: 1rem;
        border: 4px solid #00c8ff;
        white-space: pre-wrap;
        display: block; /* Change this to 'none' if you want it hidden initially */
    }
</style>
