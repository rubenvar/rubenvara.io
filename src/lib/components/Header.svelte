<script>
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import ThemeButton from './theme/ThemeButton.svelte';
</script>

<header>
    <div class="wrapper">
        <h2>
            <a href={resolve('/')}>rubenvara.io</a>
        </h2>
        <div class="right">
            <ThemeButton />
            {#if !page.url.pathname.includes('/blog')}
                <a href={resolve('/blog')}>Ir al blog</a>
            {/if}
        </div>
    </div>
</header>

<style>
    header {
        background: var(--white);
        margin: 0;
        padding: var(--gap20) 0;
        > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 100%;
            margin: 0 var(--gap50);
            position: relative;
            @media only screen and (min-width: 740px) {
                width: var(--maxWidth);
                margin: 0 auto;
            }
            h2 {
                font-size: 1.85rem;
                margin: 0;
                line-height: 1;
                font-family: var(--logoFont);
                font-weight: 700;
                a {
                    background: var(--logoGradient);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: var(--primary500);
                    color: transparent;
                    text-decoration: none;
                }
            }
            .right {
                display: flex;
                gap: var(--gap60);
                align-items: center;
                a {
                    text-decoration: none;
                    color: var(--primary600);
                    line-height: 1;
                    &:hover {
                        color: var(--primary400);
                    }
                }
            }
        }
    }
</style>
