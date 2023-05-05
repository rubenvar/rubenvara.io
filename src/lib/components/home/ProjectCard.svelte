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
    margin: var(--gap40) 0 var(--gap90);
    display: block;
    &:last-of-type {
      margin-bottom: var(--gap60);
    }
  }
  button {
    border-radius: var(--radius30);
    padding: var(--gap10);
    background-color: var(--customColor);
    background: linear-gradient(
      -210deg,
      var(--customColor),
      hsla(0, 0%, 99%, 0.9) 55%
    );
    box-shadow: none;
    border: none;
    text-align: left;
    font-size: var(--fz30);
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
</style>
