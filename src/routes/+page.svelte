<script lang="ts">
    import Header from '$lib/components/home/Header.svelte';
    import HomeSpanish from '$lib/components/home/HomeSpanish.svelte';
    import { siteUrl } from '$lib/config';
    import { latestPosts } from '$lib/stores/latestPosts';

    let { data } = $props();

    $effect(() => {
        if (data) {
            latestPosts.set(data.homePosts);
        }
    });

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
        sameAs: ['https://github.com/rubenvar', 'https://www.linkedin.com/in/rubenvar', 'https://x.com/rubenvara01'],
    };
</script>

<svelte:head>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `<script type="application/ld+json">${JSON.stringify(entitySchema)}${'<'}/script>`}
</svelte:head>

<Header />
<HomeSpanish />
