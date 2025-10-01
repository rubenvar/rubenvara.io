<script lang="ts">
    import type { Snippet } from 'svelte';
    import BoxRecuerda from './boxes/BoxRecuerda.svelte';

    interface Props {
        type?: 'recuerda' | 'translated' | 'updated' | 'info';
        children: Snippet;
    }

    let { type = 'info', children }: Props = $props();
</script>

{#if type === 'recuerda'}
    <BoxRecuerda>
        {@render children()}
    </BoxRecuerda>
{:else}
    <div class="box {type}">
        {@render children()}
    </div>
{/if}
