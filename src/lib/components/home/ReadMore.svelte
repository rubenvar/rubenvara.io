<script lang="ts">
  export let href: string;
</script>

<p class="read-more"><a {href}><slot /></a></p>

<style>
  .read-more {
    text-align: right;
    a {
      text-decoration: none;
    }
  }
</style>
