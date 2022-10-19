<script lang="ts">
  export let twitter: string | undefined;
</script>

<div class="outer">
  <div class="inner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      stroke="none"
      width="50"
      height="50"
    >
      <path d="M0 0h400v400H0z" fill="none" />
      <path
        fill="hsl(203, 89%, 53%)"
        d="M153.62 301.59c94.34 0 145.94-78.16 145.94-145.94 0-2.22 0-4.43-.15-6.63A104.36 104.36 0 00325 122.47a102.38 102.38 0 01-29.46 8.07 51.47 51.47 0 0022.55-28.37 102.79 102.79 0 01-32.57 12.45 51.34 51.34 0 00-87.41 46.78A145.62 145.62 0 0192.4 107.81a51.33 51.33 0 0015.88 68.47A50.91 50.91 0 0185 169.86v.65a51.31 51.31 0 0041.15 50.28 51.21 51.21 0 01-23.16.88 51.35 51.35 0 0047.92 35.62 102.92 102.92 0 01-63.7 22 104.41 104.41 0 01-12.21-.74 145.21 145.21 0 0078.62 23"
      />
    </svg>
    {#if twitter}
      <p>
        No hay sección de comentarios, pero ya estamos hablando sobre este tema
        en Twitter: <a href={twitter} target="_blank" rel="noreferrer"
          >acércate y cuéntanos tu opinión</a
        >!
      </p>
    {:else}
      <p>
        No hay sección de comentarios, pero me encantaría escuchar tu opinión: <a
          href="https://www.twitter.com/rubenvara01"
          target="_blank"
          rel="noreferrer">escríbeme en Twitter</a
        > y cuéntame!
      </p>
    {/if}
  </div>
</div>

<style lang="scss">
  /* make a gradient border with inner and outer divs */
  .outer {
    margin-top: var(--gap110);
    background: linear-gradient(315deg, hsl(203, 89%, 53%), hsl(203, 89%, 83%));
    border-radius: var(--radius10);
    padding: 4px;
    .inner {
      border-radius: var(--radius10);
      padding: var(--gap30);
      position: relative;
      background: var(--white);
      svg {
        position: absolute;
        bottom: 0;
        right: 0;
      }
      p {
        color: var(--grey700);
        margin: 0;
        a {
          color: hsl(203, 99%, 23%);
          &:hover {
            color: inherit;
          }
        }
      }
    }
  }
</style>
