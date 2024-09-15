<script lang="ts">
  import Header from '$lib/components/home/Header.svelte';
  import HomeSpanish from '$lib/components/home/HomeSpanish.svelte';
  import { siteUrl } from '$lib/config';
  import { latestPosts } from '$lib/stores/latestPosts';
  import type { PageData } from './$types';

  export let data: PageData;

  $: homePosts = data.homePosts;

  $: if (homePosts) {
    latestPosts.set(homePosts);
  }

  const entitySchema = {
    '@type': 'Person',
    '@id': `${siteUrl}/#/schema/person/Person`,
    name: 'Rubén Vara',
    url: `${siteUrl}/about`,
    image: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#personlogo`,
      url: `${siteUrl}/icon.png`,
      height: '128',
      width: '128',
    },
    sameAs: [
      'https://github.com/rubenvar',
      'https://www.linkedin.com/in/rubenvar',
      'https://x.com/rubenvara01',
    ],
  };
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(entitySchema)}${'<'}/script>`}
</svelte:head>

<Header />
<HomeSpanish />
