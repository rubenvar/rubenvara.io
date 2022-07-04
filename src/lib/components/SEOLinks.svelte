<script lang="ts">
  import { dev } from '$app/env';
  import type { CountedLink } from '$lib/utils/types';

  export let allLinks: CountedLink[];
  export let link: CountedLink | undefined;

  const linkedFrom = !!link
    ? allLinks.filter((l) => link && l.internal.includes(`${link.slug}/`))
    : [];

  let showFrom = true;
  let showInternal = true;
  let showExternal = false;
</script>

{#if dev && link}
  <div>
    <ul>
      <li
        class:has-inner={linkedFrom.length >= 1}
        class:dang={linkedFrom.length < 1}
        class:succ={linkedFrom.length >= 1}
        on:click={() => (showFrom = !showFrom)}
      >
        Linked from {linkedFrom.length} internal
        {#if linkedFrom.length > 0 && showFrom}
          <ul>
            {#each linkedFrom as l}
              <li>{l.slug}</li>
            {/each}
          </ul>
        {/if}
      </li>
      <li
        class:has-inner={link.internalTotal >= 1}
        class:warn={link.internalTotal < 1}
        class:succ={link.internalTotal >= 1}
        on:click={() => (showInternal = !showInternal)}
      >
        Links {link.internalTotal} internal
        {#if link.internalTotal > 0 && showInternal}
          <ul>
            {#each link.internal as l}
              <li>{l}</li>
            {/each}
          </ul>
        {/if}
      </li>
      <li
        class:has-inner={link.externalTotal >= 1}
        class:dang={link.externalTotal < 1}
        class:succ={link.externalTotal >= 1}
        on:click={() => (showExternal = !showExternal)}
      >
        Links {link.externalTotal} external.
        {#if link.externalTotal > 0 && showExternal}
          <ul>
            {#each link.external as l}
              <li>{l}</li>
            {/each}
          </ul>
        {/if}
      </li>
    </ul>
  </div>
{/if}

<style lang="scss">
  div {
    margin-top: calc(-1 * var(--gap100));
    margin-bottom: var(--gap120);
    border: 1px solid var(--grey300);
    border-radius: var(--radius20);
    padding: var(--gap10) 0;
    font-size: var(--fz10);
    ul {
      margin: 0;
      padding-left: var(--gap70);
      li {
        margin: 0;
        &.has-inner {
          cursor: pointer;
          transition: background-color 0.3s;
          &:hover {
            background-color: var(--grey100);
          }
        }
        ul {
          margin-bottom: var(--gap20);
        }
        &.succ {
          color: var(--success600);
        }
        &.warn {
          color: var(--warning600);
        }
        &.dang {
          color: var(--danger600);
        }
      }
    }
  }
</style>
