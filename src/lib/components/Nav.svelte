<script>
  import { page } from '$app/stores';
</script>

<nav>
  {#if $page.url.pathname !== '/'}
    <a href="/">Inicio</a>
    <span>◇</span>
  {/if}
  <a class:active={$page.url.pathname.includes('/blog')} href="/blog">Blog</a>
  <span>◇</span>
  <a class:active={$page.url.pathname === '/now'} href="/now">Ahora</a>
</nav>

<style lang="scss">
  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--gap70);
    padding: var(--gap80) 0 var(--gap110);
    font-size: var(--fontSize60);
    a {
      text-decoration: none;
      color: var(--primary700);
      &.active {
        font-weight: 700;
      }
      &:hover {
        color: var(--primary300);
      }
    }
    span {
      font-size: var(--fontSize30);
      color: var(--secondary500);
      opacity: 0.8;
    }
  }
</style>
