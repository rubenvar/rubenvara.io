<!-- unused -->
<script lang="ts">
  export let type = 'info';
</script>

<div class="box {type}">
  <slot />
</div>

<style lang="scss">
  div {
    border: 1px solid;
    padding: var(--gap40);
    padding-bottom: 0; /* ಠ_ಠ */
    border-radius: var(--radius10);
    margin-bottom: var(--gap60);
    > *:last-child {
      margin-bottom: 0;
    }
    &.info {
      border-color: var(--note500);
    }
    &.updated {
      border-color: orange;
    }
    &.recuerda {
      border-color: var(--announce500);
    }
    &.traduccion {
      border-width: 2px;
      border-color: var(--grey600);
    }
  }
</style>
