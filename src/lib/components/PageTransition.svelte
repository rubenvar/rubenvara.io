<script>
  import { fly } from 'svelte/transition';
  export let refresh = '';
</script>

{#key refresh}
  <div
    id="wrapper"
    in:fly={{ duration: 300, delay: 150 }}
    out:fly={{ duration: 300 }}
  >
    <slot />
  </div>
{/key}
