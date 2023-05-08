<script lang="ts">
  import { fade } from 'svelte/transition';
  import TechTag from './TechTag.svelte';

  export let id: string;
  export let title: string;
  export let techs: string[] = [];
  export let browser: string;
  export let iphone: string;

  // --caa600
  // --tn500
  // --vpnf600
  const customColor = `${id}600`;

  // imgs outside button only show if widerthan 1200px
  // if not, images inside .inner will show
</script>

<a href="https://{title}" target="_blank">
  <button
    style="--customColor: var(--{customColor})"
    id="button-{id}"
    transition:fade={{ duration: 200 }}
  >
    <div class="inner">
      <h3>{title}</h3>
      <div class="mobile-images">
        <img
          class="mobile-screenshot mobile-browser"
          src={browser}
          alt="página pricipal de {title}"
        />
        <img
          class="mobile-screenshot mobile-iphone"
          src={iphone}
          alt="{title} en iPhone"
        />
      </div>
      <div class="text">
        <slot />
      </div>
      <div class="tech">
        {#each techs as tech}
          <TechTag {tech} />
        {/each}
      </div>
    </div>
  </button>
  <img
    class="screenshot browser"
    src={browser}
    alt="Página Principal de {title}"
  />
  <img class="screenshot iphone" src={iphone} alt="{title} en iPhone" />
</a>

<style lang="scss">
  a {
    margin: var(--gap40) 0 var(--gap100);
    display: block;
    position: relative;
    &:last-of-type {
      margin-bottom: var(--gap60);
    }
    &:hover {
      @media only screen and (min-width: 768px) {
        button::before {
          opacity: 1;
          transition: opacity 0.4s;
        }
        .screenshot {
          scale: 1.35;
          translate: calc(30% + 15px) 90px;
          &.iphone {
            translate: calc(100%) 90px;
          }
        }
        .mobile-screenshot {
          scale: 1.35;
          &.mobile-browser {
            translate: 50px 30px;
          }
          &.mobile-iphone {
            translate: calc(100%) 90px;
          }
        }
      }
    }
  }
  button {
    border-radius: var(--radius30);
    padding: var(--gap10);
    background-color: var(--customColor);
    background: linear-gradient(
      -210deg,
      var(--customColor),
      hsla(0, 0%, 99%, 0.9) 55% /* --white variable with alpha, hardcoded */
    );
    box-shadow: none;
    border: none;
    text-align: left;
    font-size: var(--fz30);
    position: relative;
    z-index: 1;
    @media only screen and (max-width: 768px) {
      background: linear-gradient(
        -200deg,
        var(--customColor),
        hsla(0, 0%, 99%, 0.9) 85% /* --white variable with alpha, hardcoded */
      );
    }
    &::before {
      /* background gradient transition trick */
      border-radius: var(--radius30);
      background: var(--black);
      background: linear-gradient(
        -210deg,
        var(--customColor),
        var(--grey700) 55%,
        var(--customColor)
      );
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.75s;
    }
    .inner {
      background-color: var(--white);
      border-radius: var(--radius20);
      padding: var(--gap30);
      h3 {
        margin-top: 0;
        margin-bottom: var(--gap40);
      }
      .mobile-images {
        width: 75%;
        margin: 0 0 var(--gap40) var(--gap40);
        position: relative;
        @media only screen and (min-width: 1200px) {
          display: none;
        }
        @media only screen and (min-width: 768px) {
          width: 50%;
        }
        @media only screen and (min-width: 576px) {
          width: 65%;
        }
        img {
          display: block;
          transition: scale 0.3s, translate 0.3s;
        }
        .mobile-browser {
          rotate: -1deg;
          border-radius: var(--radius20);
          box-shadow: var(--bs20);
        }
        .mobile-iphone {
          position: absolute;
          top: 0;
          right: 0;
          max-height: 70%;
          translate: 50px 20px;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
          rotate: 4deg;
        }
      }
      .tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--gap20);
        margin-bottom: var(--gap10);
      }
    }
  }
  .screenshot {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    transition: scale 0.3s, translate 0.3s;
    &.browser {
      border-radius: var(--radius20);
      box-shadow: var(--bs20);
      translate: calc(90% + 15px) 70px;
      rotate: 3deg;
      max-width: 250px;
    }
    &.iphone {
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
      translate: calc(100% + 50px) 160px;
      rotate: -4deg;
      max-height: 140px;
    }
    @media only screen and (max-width: 1200px) {
      display: none;
      position: relative;
      &.browser,
      &.iphone {
        translate: none;
        rotate: none;
      }
    }
  }
</style>
