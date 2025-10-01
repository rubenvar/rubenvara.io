<script lang="ts">
    import shuffle from 'just-shuffle';
    import rvImage from '$lib/assets/images/rv.webp';
    import LatestPosts from './LatestPosts.svelte';
    import CardCaa from './CardCaa.svelte';
    import CardTn from './CardTn.svelte';
    import CardVpnf from './CardVpnf.svelte';
    import ReadMore from './ReadMore.svelte';
    import SocialLinks from './SocialLinks.svelte';

    const things = [
        'nado',
        'corro por el monte',
        'leo novelas',
        'dibujo',
        'cocino',
        'degusto craft beer',
        'escribo',
        'bebo café',
        'escucho dub y reggae',
        'dibujo',
    ];
</script>

<h2 class="title">Desarollo páginas web naturales, rápidas y modernas</h2>
<p class="sub-title">
    También {shuffle(things).join(', ')} y trabajo en más proyectos web.
</p>
<img src={rvImage} alt="Rubén Vara" width={300} height={300} />
<p class="about-me">
    Durante una vida pasada estudié ingeniería, lo abandoné todo para viajar por el mundo, creé un negocio online. Después volví al inicio, a trazar nuevos
    planes y empezar una nueva vida.
</p>
<ReadMore href="/about">Lee más sobre mí ⟶</ReadMore>

<div class="project-intro">
    <h2 class="section-title">Algunos proyectos</h2>
    <p>Desde hace años, todas las semanas tengo ideas que convierto en proyectos. Algunos los publico. A veces funcionan. Siempre aprendo algo nuevo.</p>
</div>
<CardCaa />
<CardTn />
<CardVpnf />
<p class="project-outro">
    Además, <a href="https://rubenvar.github.io/" target="_blank">un listado con más proyectos</a>.
</p>
<p>
    En mi
    <a href="https://github.com/rubenvar" target="_blank">GitHub</a>
    está todo el código que escribo para mis proyectos personales, además de unos cuantos
    <em>npm packages</em> que he publicado.
</p>

<SocialLinks />
<h2 class="section-title">Posts más recientes</h2>
<LatestPosts />

<style>
    h2 {
        &.title {
            margin-top: var(--gap50);
            font-weight: 400;
        }
        &.section-title {
            margin-top: var(--gap100);
            font-style: italic;
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
    .about-me {
        margin-bottom: var(--gap40);
    }

    .project-intro {
        margin-bottom: var(--gap80);
        p {
            margin-bottom: 0;
        }
    }
    .project-outro {
        color: var(--grey700);
        margin-top: var(--gap80);
    }
</style>
