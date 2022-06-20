<script lang="ts">
  export let type: 'info';
</script>

<div class={type}>
  <slot />
</div>

<style lang="scss">
  div {
    border: 1px solid;
    padding: var(--gap40);
    padding-bottom: 0; /* ಠ_ಠ */
    > *:last-child {
      margin-bottom: 0;
    }
    &.info {
      color: green;
    }
  }
</style>
