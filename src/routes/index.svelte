<script lang="ts">
  import HomeText from '$lib/components/HomeText.svelte';
  import rvImage from '$lib/assets/images/rv.webp';
  import ListedPost from '$lib/components/ListedPost.svelte';
  import type { Post } from '$lib/utils/types';
  // import CardCAA from '$lib/components/CardCAA.svelte';
  // import CardTN from '$lib/components/CardTN.svelte';
  // import CardVPNF from '$lib/components/CardVPNF.svelte';

  export let latestPosts: Post[];

  // separate the letters
  const letters = Array.from('Rubén Vara');
</script>

<h1>
  {#each letters as letter}
    <span class={letter === ' ' ? '💩' : `🚀 ${letter}`}>
      {letter}
    </span>
  {/each}
</h1>
<h2>Desarollo páginas web naturales, rápidas y modernas</h2>
<p>
  En los ratos libres escalo todo lo que puedo, leo, dibujo, y trabajo en más
  proyectos web.
</p>
<img src={rvImage} alt="Rubén Vara" width={300} height={300} />

<h2 class="section-title">Durante la década pasada...</h2>
<HomeText />

<h2 class="section-title">Posts más recientes</h2>
<p class="blog-intro">
  En mi blog escribo sobre JavaScript y otros inventos modernos. Mira los
  últimos artículos:
</p>
{#each latestPosts as post}
  <ListedPost {post} />
{/each}
<p class="read-more"><a href="/blog">Ver todos ⟶</a></p>

<!-- <h2 class="section-title">Algunos proyectos</h2>
<CardCAA />
<CardTN />
<CardVPNF />
<hr />
<p>
  Desde hace unos cuantos años, casi cada mes tengo una idea y empiezo un nuevo
  proyecto. Algunos los termino. A veces funcionan. Siempre aprendo algo nuevo,
  todos los días.
</p> -->
<style lang="scss">
  @keyframes changeColor {
    0% {
      color: var(--primary400);
    }
    20% {
      color: var(--primary700);
    }
    40% {
      color: var(--primary600);
    }
    60% {
      color: var(--primary400);
    }
    80% {
      color: var(--primary700);
    }
    100% {
      color: var(--primary500);
    }
  }
  h1 {
    font-family: var(--logoFont);
    font-size: var(--fz150);
    /* letter-spacing: -1px; */
    color: var(--primary500);
    /* this would chose a color randomly for each letter, could be done in js? */
    /* color: var(--${randomColor}); */
    @media only screen and (min-width: 780px) {
      animation: changeColor 11s infinite alternate;
    }
    span {
      &.🚀 {
        display: inline-block;
        transition: all 0.4s;
        &:hover {
          transform: translateY(-20px);
          &:nth-child(4) {
            transform: translateY(-20px) translateX(-6px) rotate(-23deg);
          }
          &:nth-child(10) {
            transform: translateY(19px) translateX(6px) rotate(33deg);
          }
        }
      }
      &.V {
        letter-spacing: -4px;
      }
    }
  }
  h2 {
    margin-top: var(--gap50);
    font-weight: 400;
    &.section-title {
      margin-top: var(--gap100);
      font-style: italic;
      font-family: var(--specialFont);
      font-weight: 700;
      font-size: var(--fz70);
    }
  }
  img {
    border: 5px solid var(--grey700);
    border-radius: 50%;
  }
  .blog-intro {
    color: var(--grey600);
    margin: 0 0 var(--gap100);
    &:last-child {
      margin-bottom: 0;
    }
  }
  .read-more {
    text-align: right;
    a {
      text-decoration: none;
    }
  }
</style>
