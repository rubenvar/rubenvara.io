<script lang="ts">
  import HomeText from '$lib/components/home/HomeText.svelte';
  import rvImage from '$lib/assets/images/rv.webp';
  import LatestPosts from './LatestPosts.svelte';
  import CardCaa from './CardCaa.svelte';
  import CardTn from './CardTn.svelte';
  import CardVpnf from './CardVpnf.svelte';
  import { dev } from '$app/environment';
</script>

<h2>Desarollo páginas web naturales, rápidas y modernas</h2>
<p>
  En los ratos libres escalo todo lo que puedo, leo, dibujo, y trabajo en más
  proyectos web.
</p>
<img src={rvImage} alt="Rubén Vara" width={300} height={300} />

<h2 class="section-title">Durante la década pasada...</h2>
<HomeText />

{#if dev}
  <div class="project-intro">
    <h2 class="section-title">Algunos proyectos</h2>
  </div>
  <CardCaa />
  <CardTn />
  <CardVpnf />
  <p class="project-outro">
    Desde hace unos cuantos años, casi cada mes tengo una idea y empiezo un
    nuevo proyecto. Algunos los termino. A veces funcionan. Siempre aprendo algo
    nuevo, todos los días.
  </p>
{/if}

<h2 class="section-title">Posts más recientes</h2>
<LatestPosts />

<style lang="scss">
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
  .project-intro {
    margin-bottom: var(--gap80);
  }
  .project-outro {
    margin-top: var(--gap80);
  }
</style>
