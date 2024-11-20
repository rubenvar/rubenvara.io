<script lang="ts">
  interface Props {
    title: string;
    content?: string;
  }

  let { title, content }: Props = $props();
</script>

<header>
  <h1>{title}</h1>
  {#if content}<p>{content}</p>{/if}
</header>

<style>
  header {
    margin-bottom: var(--gap50);
  }
  h1 {
    color: var(--primary500);
    margin-bottom: var(--gap30);
  }
  p {
    margin-bottom: 0;
  }
</style>
