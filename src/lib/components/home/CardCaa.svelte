<script lang="ts">
    import ProjectCard from './ProjectCard.svelte';
    import caaBrowser from '$lib/assets/images/caa-browser.webp';
    import caaIphone from '$lib/assets/images/caa-iphone.webp';

    const techs = ['React 19', 'Next.js 15', 'Typescript', 'tanstack-query', 'tRPC', 'node.js', 'Fastify', 'Prisma', 'MongoDB'];
</script>

<ProjectCard id="caa" title="calendarioaguasabiertas.com" {techs} browser={caaBrowser} iphone={caaIphone}>
    <p>
        Un mega-listado de todas las travesías de natación en el estado, y el proyecto del que <strong>más orgulloso</strong> estoy. He trabajado en él desde hace
        6 años.
    </p>
    <p>Visitado por más de 30k personas al mes, miles de nadadores confían en el Calendario para planificar su tiempo.</p>
</ProjectCard>

<style>
    p {
        margin-bottom: var(--gap40);
    }
</style>
