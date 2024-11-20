<script>
  import { version } from '$app/environment';
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
      v{version} · ©{new Date().getFullYear()} rubenvara.io ·{' '}
      <a href="mailto:hey@rubenvara.io">Contacto</a>
    </p>
  </div>
</footer>

<style>
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
    padding: var(--gap50) 0;
    position: relative;
    margin-top: var(--gap120);
    background: var(--white);
    transition: all 0.3s;
    p {
      margin: 0;
      font-size: var(--fz20);
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
