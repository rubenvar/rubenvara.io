<script lang="ts">
  import type { PostMeta } from '$lib/utils/types';
  import Box from './Box.svelte';

  export let original: PostMeta['original'];
  export let seriesName: string | undefined;
  // TODO created only for tkdodo's translated post series for now
  // TODO will have to improve it in the future for more series/translations
</script>

{#if original && seriesName === 'react-query-tkdodo'}
  <Box type="traduccion">
    <p>
      Este artículo es una <strong>traducción</strong> del post
      <a href={original.url}>"{original.title}"</a> publicado por Dominik en su blog
      TkDodo.eu
    </p>
  </Box>
{/if}

<style lang="scss">
  p {
    margin-bottom: var(--gap40);
  }
</style>
