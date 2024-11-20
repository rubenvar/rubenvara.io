<script lang="ts">
  // TODO will have to improve it in the future for more series/translations
  import type { PostMeta } from '$lib/utils/types';
  import Box from './Box.svelte';

  interface Props {
    original: PostMeta['original'];
    seriesName: string | undefined; // TODO created only for tkdodo's translated post series for now
  }

  let { original, seriesName }: Props = $props();
</script>

{#if original && seriesName === 'react-query-tkdodo'}
  <Box type="translated">
    <p>
      Este artículo es una <strong>traducción</strong> del post
      <a href={original.url}>"{original.title}"</a> publicado por Dominik en su blog
      TkDodo.eu
    </p>
  </Box>
{/if}

<style>
  p {
    margin-bottom: var(--gap40);
  }
</style>
