<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  const techs = [
    'React',
    'Gatsby 4',
    'Sapper',
    'GraphQL',
    'REST',
    'AWS Lambda',
  ];
</script>

<ProjectCard {techs} id="vpnf" title="vpnfacil.com">
  <div slot="text">
    <p>
      Una herramienta para elegir VPN: un listado con decenas de servicios VPN,
      datos sobre cada uno, comparativas, opiniones, etc.
    </p>
    <p>
      Empezó como un <em>side-project</em> para aprender Sapper. Cuando lo terminé,
      lo reescribí completamente en Gatsby para aprender este también. Ahora funcionan
      ambas webs.
    </p>
    <p>
      El backend es una hoja de Google Sheets 😆 que sirve de API REST a través
      de una función Lambda de AWS.
    </p>
  </div>
  <div slot="stats"><p>some easy stats here here</p></div>
  <p slot="short">
    Una herramienta para elegir VPN: un listado con decenas de servicios VPN,
    datos sobre cada uno, comparativas, opiniones, etc.
  </p>
</ProjectCard>
