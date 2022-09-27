<script lang="ts">
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import TechTag from './TechTag.svelte';

  export let id: string;
  export let title: string;
  export let techs: string[] = [];

  let showBig = false;

  const close = () => {
    showBig = false;
    goto(`#button-${id}`);
  };

  const handleClick = () => {
    showBig = !showBig;
    if (showBig) goto(`#card-${id}`);
  };

  // bind component size to these
  let w: number;
  let h: number;
  // x and y for the gradient, always between 35 and 65
  let x = 0;
  let y = 0;

  // TODO debounce this
  const handleMousemove = (event: MouseEvent) => {
    x = (event.clientX * 20) / w - 10;
    y = (event.clientY * 20) / h - 10;
  };

  // --caa600
  // --tn500
  // --vpnf600
  const customColor = `${id}600`;
</script>

{#if showBig}
  <article
    bind:clientWidth={w}
    bind:clientHeight={h}
    style="--customColor: var(--{customColor});--x: {x}%;--y: {y}%;"
    id="card-{id}"
    transition:fade={{ duration: 200 }}
    on:mousemove={handleMousemove}
  >
    <div class="main">
      <button class="close" on:click={close}>&times;</button>
      <h3>{title}</h3>
      <div class="tech">
        {#each techs as tech}
          <TechTag {tech} />
        {/each}
      </div>
      <div class="text">
        <slot name="text" />
      </div>
      <div class="stats">
        <slot name="stats">some easy stats here</slot>
      </div>
    </div>
  </article>
{:else}
  <button
    style="--customColor: var(--{customColor})"
    class="toggle"
    id="button-{id}"
    on:click={handleClick}
    transition:fade={{ duration: 200 }}
  >
    <div class="text">
      <h3>{title}</h3>
      <slot name="short" />
    </div>
  </button>
{/if}

<style lang="scss">
  .toggle {
    border-radius: var(--radius30);
    padding: var(--gap20);
    background-color: var(--customColor);
    background: linear-gradient(
      25deg,
      var(--customColor),
      black,
      var(--customColor)
    );
    box-shadow: none;
    border: none;
    text-align: left;
    margin: var(--gap60) 0;
    .text {
      background-color: var(--white);
      background-color: #fffd;
      border-radius: var(--radius20);
      padding: var(--gap20);
    }
  }
  .close {
    background: none;
    line-height: 0;
    display: block;
    font-size: var(--fz110);
    box-shadow: none;
    color: var(--white);
    border: none;
    border-radius: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: var(--gap60);
    right: var(--gap40);
  }
  article {
    padding: var(--gap80) var(--gap100);
    /* background-color: var(--customColor); */
    transition: all 0.3s;
    color: var(--white);
    width: 100%;
    /* min-height: 105vh; */
    min-height: 75vh;
    margin: 0;
    grid-column: 1 / -1;
    position: relative;
    overflow: hidden;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    &::after {
      width: 180%;
      height: 180%;
      position: absolute;
      z-index: 0;
      right: -40%;
      top: -40%;
      transition: all 0.2s;
      background: radial-gradient(circle, #000, var(--customColor) 150%);
      transform: translateX(var(--x)) translateY(var(--y));
      content: '';
    }
    .main {
      z-index: 1;
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 0 var(--gap40);
      h3 {
        margin-top: 0;
        margin-bottom: var(--gap80);
        grid-column: 2;
        font-size: var(--fz80);
      }
      .tech {
        grid-row: 2;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .text {
        grid-row: 2;
        width: var(--maxWidth);
      }
      .stats {
        grid-row: 2;
      }
    }
  }
</style>
