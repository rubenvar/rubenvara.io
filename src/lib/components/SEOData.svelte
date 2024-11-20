<script lang="ts">
  import { dev } from '$app/environment';
  import type { CountedLink, CountWords } from '$lib/utils/types';

  interface Props {
    allLinks: CountedLink[];
    link: CountedLink | undefined;
    allWords: CountWords[];
    words: CountWords | undefined;
  }

  let { allLinks, link, allWords, words }: Props = $props();

  const linkedFrom = link
    ? allLinks.filter((l) => link && l.internal.includes(`${link.slug}/`))
    : [];

  const allWordCounts = allWords.map((w) => w.wordCount).sort((a, b) => a - b);
  const currentIndex = words?.wordCount
    ? allWordCounts.indexOf(words?.wordCount)
    : 0;
  const wordsPercent = Math.round(
    ((currentIndex + 1) * 100) / allWordCounts.length
  );

  let showFrom = $state(true);
  let showInternal = $state(true);
  let showExternal = $state(false);
</script>

{#if dev && (link || words)}
  <div>
    {#if link}
      <ul>
        <li
          class:has-inner={linkedFrom.length >= 1}
          class:dang={linkedFrom.length < 1}
          class:succ={linkedFrom.length >= 1}
        >
          <button onclick={() => (showFrom = !showFrom)}>
            Linked from {linkedFrom.length} internal
            {#if linkedFrom.length > 0 && showFrom}
              <ul>
                {#each linkedFrom as l}
                  <li>{l.slug}</li>
                {/each}
              </ul>
            {/if}
          </button>
        </li>
        <li
          class:has-inner={link.internalTotal >= 1}
          class:warn={link.internalTotal < 1}
          class:succ={link.internalTotal >= 1}
        >
          <button onclick={() => (showInternal = !showInternal)}>
            Links {link.internalTotal} internal
            {#if link.internalTotal > 0 && showInternal}
              <ul>
                {#each link.internal as l}
                  <li>{l}</li>
                {/each}
              </ul>
            {/if}
          </button>
        </li>
        <li
          class:has-inner={link.externalTotal >= 1}
          class:dang={link.externalTotal < 1}
          class:succ={link.externalTotal >= 1}
        >
          <button onclick={() => (showExternal = !showExternal)}>
            Links {link.externalTotal} external.
            {#if link.externalTotal > 0 && showExternal}
              <ul>
                {#each link.external as l}
                  <li>{l}</li>
                {/each}
              </ul>
            {/if}
          </button>
        </li>
      </ul>
    {/if}
    {#if words}
      <ul>
        <li>
          Word count: {words.wordCount}.{#if words?.wordCount > 0}
            {' '}Higher than {wordsPercent}% of all posts{/if}
        </li>
        <li>
          Read time: {Math.ceil(words.minutes)} minutes ({Math.floor(
            words.minutes * 100
          ) / 100})
        </li>
      </ul>
    {/if}
  </div>
{/if}

<style>
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
        button {
          font-size: inherit;
          background: none;
          border: none;
          box-shadow: none;
          display: block;
          text-align: left;
          color: inherit;
          width: 100%;
          padding: 0;
          line-height: inherit;
        }
      }
    }
  }
</style>
