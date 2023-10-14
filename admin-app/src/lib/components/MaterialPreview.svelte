<script lang="ts">
    import CodeBlock from './CodeBlock.svelte';
    export let text = '';

    let blocks = [];

    $: {
        const regex = /###code###[\s\S]*?###\/code###|[\s\S]+?(?=###code###|$)/g;
        const matches = Array.from(text.matchAll(regex));
        blocks = matches.map(match => {
            let block = match[0];

            if (block.startsWith("###code###")) {
                block = block.replace("###code###", "").replace("###/code###", "");
                return { type: "code", content: block.trim() };
            } else {
                return { type: "text", content: block.trim() };
            }
        });
    }
</script>

{#each blocks as block}
    {#if block.type === 'code'}
        <CodeBlock code={block.content} />
    {:else}
        <p>{block.content}</p>
    {/if}
{/each}
