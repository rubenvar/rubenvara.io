<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        type?: string;
        children: Snippet;
    }

    let { type = 'default', children }: Props = $props();
</script>

<span class="emphasis emphasis-{type}">
    {@render children()}
</span>
