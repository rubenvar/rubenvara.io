<script lang="ts">
  export let title: string;
  export let content: string | undefined;
</script>

<header>
  <h1>{title}</h1>
  {#if content}<p>{content}</p>{/if}
</header>

<style lang="scss">
  header {
    margin-bottom: var(--gap50);
    h1 {
      color: var(--primary500);
      margin-bottom: var(--gap30);
    }
    p {
      margin-bottom: 0;
    }
  }
</style>
