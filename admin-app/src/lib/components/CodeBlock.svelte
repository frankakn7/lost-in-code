<script lang="ts">
    import {onMount} from 'svelte';
    import "svelte-highlight/styles/night-owl.css";
    import hljs from 'highlight.js/lib/core';
    import php from 'highlight.js/lib/languages/php';
    import java from 'highlight.js/lib/languages/java';
    import {SupportedProgLang} from "$lib/types/SupportedProgLang";

    hljs.registerLanguage('php', php);
    hljs.registerLanguage('java', java);

    export let code: string;
    export let prog_lang: string = SupportedProgLang.PHP;

    let preElement: HTMLPreElement;

    const processCode = (rawCode: string) => {
        let regex = /###INPUT\|(.+?)\|(.+?)\|(.+?)###/g;
        let parts = rawCode.split(regex);
        let processedParts = [];

        for (let i = 0; i < parts.length; i += 4) {
            processedParts.push(hljs.highlight(parts[i], {language: prog_lang}).value);

            if (i + 1 < parts.length) {
                let id = parts[i + 1];
                let length = parts[i + 2];
                let whitespace = parts[i + 3] === "true" ? "" : ' style="white-space: nowrap;"';
                processedParts.push(`<input type='text' id='${id}' maxlength='${length}' style="font-family: 'forwardRegular'; font-size: inherit; padding: 5px; border: 2px solid #00c8ff; background-color: #3f414a; color: #d1d6e0"${whitespace}/>`);
            }
        }
        return processedParts.join('');
    }

    onMount(() => {
        if (preElement) {
            preElement.innerHTML = processCode(code);
        }
    });

    $: if (preElement && code) {
        preElement.innerHTML = processCode(code);
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
