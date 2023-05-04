<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  const techs = [
    'React',
    'Gatsby 4',
    'GraphQL',
    'REST',
    'AWS Lambda',
    'Svelte',
    'Sapper',
  ];
</script>

<ProjectCard {techs} id="vpnf" title="vpnfacil.com">
  <p>
    Un listado con decenas de servicios VPN y sus datos, comparativas y
    opiniones. Empezó como un <em>side-project</em> para aprender Svelte. Después
    lo reescribí entero en Gatsby (React) para aprender este también.
  </p>
  <p>
    El backend es un Google Sheet que sirve de API REST a través de una función <em
      >serverless</em
    >
    en AWS Lambda.
  </p>
</ProjectCard>
