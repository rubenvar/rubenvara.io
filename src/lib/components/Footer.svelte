<script>
  import Nav from './Nav.svelte';
  // const angle = -3;
  // calculate magic number
  // const magicNumber = Math.abs(Math.tan((angle * Math.PI) / 180) / 2);
  // get window width
  // let width;
</script>

<!-- <svelte:window bind:innerWidth={width} /> -->
<!-- <footer style="--width:{width}px;--magicNumber:{magicNumber}px;"> -->
<footer>
  <div class="wrapper">
    <Nav />
    <p>
      ©{new Date().getFullYear()} rubenvara.io ·{' '}
      <a href="mailto:hey@rubenvara.io">Contacto</a>
    </p>
    <p>
      Web creada con{' '}
      <a
        href="https://kit.svelte.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >
        SvelteKit
      </a>{' '}
      y alojada en{' '}
      <a
        href="https://www.netlify.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Netlify
      </a>
      . El código está en{' '}
      <a
        href="https://github.com/rubenvar/rubenvara.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github
      </a>
      .
    </p>
  </div>
</footer>

<style lang="scss">
  footer {
    /* can't make this work (create a top angle) */
    /* --padding: calc(var(--width) * var(--magicNumber)); */
    /* padding: calc((var(--padding) * 2) - (var(--padding) - var(--padding))) 0
      var(--gap50); */
    /* clip-path: polygon(
      0% calc(var(--padding) * 2),
      100% 0%,
      100% 100%,
      0% 100%
    ); */
    padding: var(--gap50);
    position: relative;
    margin-top: var(--gap120);
    background: var(--white);
    transition: all 0.3s;
    p {
      margin: 0;
      font-size: var(--fontSize20);
      text-align: center;
      color: var(--grey500);
      a {
        color: var(--grey600);
        text-decoration: none;
        &:hover {
          color: var(--grey500);
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
