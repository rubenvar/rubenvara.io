<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';

  const techs = [
    'React',
    'Next.js 13',
    'Typescript',
    'tanstack-query',
    'tRPC',
    'node.js',
    'Fastify',
    'Prisma',
    'MongoDB',
  ];
</script>

<ProjectCard id="caa" title="calendarioaguasabiertas.com" {techs}>
  <p>
    Un mega-listado de todas las travesías de natación en el estado, y el
    proyecto del que <strong>más orgulloso</strong> estoy. He trabajado en él casi
    a diario desde hace más de 3 años.
  </p>
  <p>
    Visitado por más de 30k personas al mes, miles de nadadores confían en el
    Calendario para planificar su tiempo.
  </p>
</ProjectCard>

<style lang="scss">
  p {
    margin-bottom: var(--gap40);
  }
</style>
