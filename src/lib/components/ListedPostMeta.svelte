<script lang="ts">
    // only used in listed post
    // listed posts appear in home, /blog, and /[category]
    import { dev } from '$app/environment';
    import type { Post } from '$lib/utils/types';
    import dayjs from 'dayjs';
    import 'dayjs/locale/es.js';

    interface Props {
        date: Post['date'];
        updated?: Post['updated'];
        category: Post['category'];
        inCategoryPage?: boolean; // is the component being used in the category page?
    }

    let { date, updated = undefined, category, inCategoryPage = false }: Props = $props();

    const dateFormat = dev ? 'D MMM YYYY' : 'MMMM YYYY';
</script>

<p class="post-meta">
    <span>
        <time dateTime={updated || date}>
            {dayjs(updated || date)
                .locale('es')
                .format(dateFormat)}
        </time>
        {#if updated}
            (actualizado)
        {/if}
    </span>
    <span>
        {#if !inCategoryPage}
            #{category.toLowerCase()}
        {/if}
    </span>
</p>

<style>
    .post-meta {
        margin: 0;
        display: flex;
        justify-content: space-between;
        gap: var(--gap40);
        color: var(--grey500);
        font-size: var(--fz30);
    }
</style>
