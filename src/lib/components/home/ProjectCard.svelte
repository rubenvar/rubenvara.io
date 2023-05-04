<script lang="ts">
  import { fade } from 'svelte/transition';
  import TechTag from './TechTag.svelte';

  export let id: string;
  export let title: string;
  export let techs: string[] = [];

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
</a>

<style lang="scss">
  a {
    margin: var(--gap40) 0 var(--gap80);
    display: block;
  }
  button {
    border-radius: var(--radius30);
    padding: var(--gap10);
    background-color: var(--customColor);
    background: linear-gradient(
      -210deg,
      var(--customColor),
      hsla(0, 0%, 99%, 0.9) 55%,
      /* var(--white) 45% */
    );
    box-shadow: none;
    border: none;
    text-align: left;
    font-size: var(--fz30);
    .inner {
      background-color: var(--white);
      /* background-color: #fffd; */
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
  /* article {
    padding: var(--gap80) var(--gap100);
    transition: all 0.3s;
    color: var(--white);
    width: 100%;
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
  } */
</style>
