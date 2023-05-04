<script lang="ts">
  import shuffle from 'just-shuffle';
  import rvImage from '$lib/assets/images/rv.webp';
  import LatestPosts from './LatestPosts.svelte';
  import CardCaa from './CardCaa.svelte';
  import CardTn from './CardTn.svelte';
  import CardVpnf from './CardVpnf.svelte';
  import { dev } from '$app/environment';
  import ReadMore from './ReadMore.svelte';

  const things = [
    'nado',
    'corro por el monte',
    'leo',
    'dibujo',
    'cocino',
    'degusto craft beer',
    'escribo',
    'bebo café',
    'escucho reggae',
  ];
</script>

<h2>Desarollo páginas web naturales, rápidas y modernas</h2>
<p class="sub-title">
  También escalo todo lo que puedo, {shuffle(things).join(', ')} y trabajo en más
  proyectos web.
</p>
<img src={rvImage} alt="Rubén Vara" width={300} height={300} />
<p>
  Durante la década pasada estudié ingeniería, abandoné una vida para empezar
  otra viviendo por el mundo y creando mi negocio online, y casi superé una
  depresión.
</p>
<ReadMore href="/about">Lee más sobre mí ⟶</ReadMore>

{#if dev}
  <div class="project-intro">
    <h2 class="section-title">Algunos proyectos</h2>
    <p>
      Desde hace unos cuantos años, todas las semanas tengo ideas que se
      convierten en proyectos. Algunos los termino. A veces funcionan. Siempre
      aprendo algo nuevo, todos los días.
    </p>
  </div>
  <CardCaa />
  <CardTn />
  <CardVpnf />
  <p class="project-outro">
    Además, <a href="https://rubenvar.github.io/" target="_blank">aquí</a>
    puedes ver otros proyectos que he creado, y en mi
    <a href="https://github.com/rubenvar" target="_blank">GitHub</a>
    está todo el código que escribo a diario, además de unos cuantos
    <em>npm packages</em> que he publicado.
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
  .sub-title {
    font-size: var(--fz50);
    color: var(--grey800);
  }
  img {
    border: 5px solid var(--grey700);
    border-radius: 50%;
    margin-bottom: var(--gap60);
  }
  .project-intro {
    margin-bottom: var(--gap80);
    p {
      margin-bottom: 0;
    }
  }
  .project-outro {
    margin-top: var(--gap80);
  }
</style>
