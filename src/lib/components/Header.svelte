<script>
  import { page } from '$app/stores';
</script>

<header>
  <div class="wrapper">
    <h2>
      <a href="/">rubenvara.io</a>
    </h2>
    {#if !$page.url.pathname.includes('/blog')}
      <a href="/blog">Ir al blog</a>
    {/if}
  </div>
</header>

<style lang="scss">
  header {
    background: var(--white);
    margin: 0;
    padding: var(--gap20) 0;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        font-size: 1.85rem;
        margin: 0;
        line-height: 1;
        font-family: var(--logoFont);
        a {
          background: var(--logoGradient);
          background-clip: text;
          -webkit-background-clip: text;
          color: var(--primary500);
          color: transparent;
          text-decoration: none;
        }
      }
      a {
        text-decoration: none;
        color: var(--primary600);
        line-height: 1;
        &:hover {
          color: var(--primary400);
        }
      }
    }
  }
  .wrapper {
    max-width: 100%;
    margin: 0 var(--gap50);
    position: relative;
    @media only screen and (min-width: 740px) {
      width: var(--maxWidth);
      margin: 0 auto;
    }
  }
</style>
