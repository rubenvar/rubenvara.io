<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href: string;
    children: Snippet;
  }

  let { href, children }: Props = $props();
</script>

<p class="read-more"><a {href}>{@render children()}</a></p>

<style>
  .read-more {
    text-align: right;
  }
  a {
    text-decoration: none;
  }
</style>
