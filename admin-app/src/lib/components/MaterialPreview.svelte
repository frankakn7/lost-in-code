<script lang="ts">
    import CodeBlock from './CodeBlock.svelte';
    import {SupportedProgLang} from "$lib/types/SupportedProgLang";
    export let text = '';
    export let prog_lang = SupportedProgLang.PHP;

    let blocks = [];

    $: {
        const regex = /###CODE###[\s\S]*?###\/CODE###|[\s\S]+?(?=###CODE###|$)/g;
        const matches = Array.from(text.matchAll(regex));
        blocks = matches.map(match => {
            let block = match[0];

            if (block.startsWith("###CODE###")) {
                block = block.replace("###CODE###", "").replace("###/CODE###", "");
                return { type: "code", content: block.trim() };
            } else {
                return { type: "text", content: block.trim() };
            }
        });
    }
</script>

{#each blocks as block}
    {#if block.type === 'code'}
        <CodeBlock code={block.content} prog_lang={prog_lang}/>
    {:else}
        <p>{block.content}</p>
    {/if}
{/each}
