<script lang="ts">
  import { fade } from 'svelte/transition';
  import TechTag from './TechTag.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    title: string;
    techs: string[];
    browser: string;
    iphone: string;
    noLink?: boolean;
    children: Snippet;
  }

  let {
    id,
    title,
    techs = [],
    browser,
    iphone,
    noLink = false,
    children,
  }: Props = $props();

  // --caa600
  // --tn500
  // --vpnf600
  const customColor = `${id}600`;

  // imgs outside button only show if wider than 1200px
  // if not, images inside .inner will show
</script>

<a
  href={noLink ? '' : `https://${title}`}
  target={noLink ? '_self' : '_blank'}
  style="--delay: {id.length * 0.2 + 1}s;"
>
  <div
    class="card"
    style="--customColor: var(--{customColor})"
    transition:fade={{ duration: 200 }}
  >
    <div class="inner">
      <h3>{title}</h3>
      <div class="mobile-images">
        <img
          class="screenshot mobile-screenshot browser"
          src={browser}
          alt="página pricipal de {title}"
        />
        <img
          class="screenshot mobile-screenshot iphone"
          src={iphone}
          alt="{title} en iPhone"
        />
      </div>
      <div class="text">
        {@render children?.()}
      </div>
      <div class="tech">
        {#each techs as tech}
          <TechTag {tech} />
        {/each}
      </div>
    </div>
  </div>
  <img
    class="screenshot wide-screenshot browser"
    src={browser}
    alt="Página Principal de {title}"
  />
  <img
    class="screenshot wide-screenshot iphone"
    src={iphone}
    alt="{title} en iPhone"
  />
</a>

<style>
  @keyframes floatIphone {
    0% {
      transform: translateX(0) translateY(0);
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
    }
    50% {
      transform: translateX(-2px) translateY(-7px);
      filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.35));
    }
  }
  a {
    border-radius: var(--radius30);
    margin: var(--gap40) 0 var(--gap100);
    display: block;
    position: relative;
    text-decoration: none;
    color: inherit;
    &:last-of-type {
      margin-bottom: var(--gap60);
    }
    &:hover {
      @media only screen and (min-width: 768px) {
        .card::before {
          opacity: 1;
          transition: opacity 0.4s;
        }
        .wide-screenshot {
          scale: 1.35;
          animation: none;
          &.browser {
            translate: calc(30% + 15px) 90px;
          }
          &.iphone {
            translate: calc(100%) 90px;
          }
        }
        .mobile-screenshot {
          scale: 1.35;
          &.browser {
            translate: 50px 30px;
          }
          &.iphone {
            translate: calc(100%) 90px;
          }
        }
      }
    }
  }
  .card {
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
        word-break: break-word; /* break title (url) if too long */
        font-weight: 450;
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
          transition:
            scale 0.3s,
            translate 0.3s;
        }
        .browser {
          rotate: -1deg;
          border-radius: var(--radius20);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35);
        }
        .iphone {
          position: absolute;
          top: 0;
          right: 0;
          max-height: 70%;
          translate: 50px 20px;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
          rotate: 4deg;
          animation: floatIphone 6s infinite ease-in-out;
          animation-delay: var(--delay);
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
  .wide-screenshot {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    transition:
      scale 0.3s,
      translate 0.3s;
    &.browser {
      border-radius: var(--radius20);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35);
      translate: calc(90% + 15px) 70px;
      rotate: 3deg;
      max-width: 250px;
    }
    &.iphone {
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
      translate: calc(100% + 50px) 160px;
      rotate: -4deg;
      max-height: 140px;
      animation: floatIphone 6s infinite ease-in-out;
      animation-delay: var(--delay);
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
