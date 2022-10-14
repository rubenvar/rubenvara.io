<script lang="ts">
  import BoxRecuerda from './boxes/BoxRecuerda.svelte';

  export let type: 'recuerda' | 'translated' | 'updated' | 'info' = 'info';
</script>

{#if type === 'recuerda'}
  <BoxRecuerda>
    <slot />
  </BoxRecuerda>
{:else}
  <div class="box {type}">
    <slot />
  </div>
{/if}
