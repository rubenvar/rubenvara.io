<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    refresh: string;
    children: Snippet;
  }

  let { refresh, children }: Props = $props();
</script>

{#key refresh}
  <!-- <div
    id="wrapper"
    in:fly={{ duration: 300, delay: 150 }}
    out:fly={{ duration: 300 }}
  > -->
  <div in:fade>
    {@render children()}
  </div>
{/key}
