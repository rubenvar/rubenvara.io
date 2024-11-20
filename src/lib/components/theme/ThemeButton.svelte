<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import IconSun from '$lib/components/icons/IconSun.svelte';
  import IconMoonStars from '$lib/components/icons/IconMoonStars.svelte';

  function toggleTheme() {
    const newTheme = $theme === 'dark' ? 'light' : 'dark';
    theme.set(newTheme);
  }
</script>

<button onclick={toggleTheme}>
  {#if $theme === 'dark'}<IconSun />{:else}<IconMoonStars />{/if}
</button>

<style>
  button {
    background: none;
    border: none;
    border-radius: 50%;
    box-shadow: none;
    padding: var(--gap20);
    @media only screen and (max-width: 640px) {
      padding: var(--gap30);
    }
    > :global(svg) {
      stroke-width: 1.5;
      color: var(--grey700);
      display: block;
    }
  }
</style>
