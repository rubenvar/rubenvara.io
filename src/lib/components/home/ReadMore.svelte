<script lang="ts">
  export let href: string;
</script>

<p class="read-more"><a {href}><slot /></a></p>

<style lang="scss">
  .read-more {
    text-align: right;
    a {
      text-decoration: none;
    }
  }
</style>
