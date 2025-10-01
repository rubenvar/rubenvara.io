<script lang="ts">
    import { resolve } from '$app/paths';

    // only used in single post top and bottom
    import type { Post } from '$lib/utils/types';
    import dayjs from 'dayjs';
    import 'dayjs/locale/es.js';

    interface Props {
        date: Post['date'];
        updated: Post['updated'];
        category: Post['category'];
        categoryCount: number | undefined; // how many posts in category
        atBottom?: boolean; // is it at single post bottom?
    }

    let { date, updated, category, categoryCount = 0, atBottom = false }: Props = $props();

    const dateFormat = 'D [de] MMMM, YYYY';
</script>

<p class="post-meta" class:at-bottom={atBottom}>
    <span>
        {#if updated}
            actualizado el
            <time dateTime={updated}>
                {dayjs(updated).locale('es').format(dateFormat)}
            </time>
        {:else}
            <time dateTime={date}>
                {dayjs(date).locale('es').format(dateFormat)}
            </time>
        {/if}
        {#if updated && atBottom}
            <br />
            publicación inicial el
            <time dateTime={date}>
                {dayjs(date).locale('es').format(dateFormat)}
            </time>
        {/if}
    </span>
    <span>
        {#if categoryCount > 2}
            <a href={resolve(`/${category}`)}>
                #{category.toLowerCase()}
            </a>
        {:else}
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
        &.at-bottom {
            margin-top: var(--gap100);
            margin-bottom: var(--gap70);
        }
        a {
            color: var(--grey700);
            &:hover {
                color: var(--primary400);
            }
        }
    }
</style>
