<script lang="ts">
  import rvImage from '$lib/assets/images/rv.webp';
  import LatestPosts from './LatestPosts.svelte';
  import CardCaa from './CardCaa.svelte';
  import CardTn from './CardTn.svelte';
  import CardVpnf from './CardVpnf.svelte';
  import { dev } from '$app/environment';
  import ReadMore from './ReadMore.svelte';
</script>

<h2>Desarollo páginas web naturales, rápidas y modernas</h2>
<p>
  También escalo, todo lo que puedo. Leo novelas. Dibujo (o lo intento). Nado.
  Cocino. Reparo o construyo cosas. Bebo café. Y <em>craft beer</em>. Intento
  tener menos. Y trabajo en más proyectos web.
</p>
<img src={rvImage} alt="Rubén Vara" width={300} height={300} />
<p>
  Durante la década pasada estudié ingeniería, abandoné una vida para empezar
  otra viviendo por el mundo y creando un negocio online, y casi superé una
  depresión.
</p>
<ReadMore href="/about">Lee más sobre mí ⟶</ReadMore>

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
    margin-bottom: var(--gap60);
  }
  .project-intro {
    margin-bottom: var(--gap80);
  }
  .project-outro {
    margin-top: var(--gap80);
  }
</style>
