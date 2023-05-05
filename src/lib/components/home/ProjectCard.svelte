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
</script>

<a href="https://{title}" target="_blank">
  <button
    style="--customColor: var(--{customColor})"
    id="button-{id}"
    transition:fade={{ duration: 200 }}
  >
    <div class="inner">
      <h3>{title}</h3>
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
  <img class="screen" src={browser} alt="Página Principal de {title}" />
  <img class="iphone" src={iphone} alt="{title} en iPhone" />
</a>

<style lang="scss">
  a {
    margin: var(--gap40) 0 var(--gap90);
    display: block;
    position: relative;
    &:last-of-type {
      margin-bottom: var(--gap60);
    }
    &:hover {
      button::before {
        opacity: 1;
        transition: opacity 0.4s;
      }
      img {
        scale: 1.75;
        translate: calc(60% + 15px) 90px;
        &.iphone {
          translate: calc(100% + 95px) 90px;
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
      .tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--gap20);
        margin-bottom: var(--gap10);
      }
    }
  }
  img {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    &.screen {
      border-radius: var(--radius20);
      box-shadow: var(--bs20);
      translate: calc(90% + 15px) 70px;
      rotate: 3deg;
      max-width: 250px;
      transition: scale 0.3s, translate 0.3s;
    }
    &.iphone {
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
      translate: calc(100% + 50px) 160px;
      rotate: -4deg;
      max-height: 140px;
      transition: scale 0.3s, translate 0.3s;
    }
  }
</style>
