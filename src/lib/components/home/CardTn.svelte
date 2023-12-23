<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import tnBrowser from '$lib/assets/images/tn-browser.webp';
  import tnIphone from '$lib/assets/images/tn-iphone.webp';
  import SoldLabel from './SoldLabel.svelte';

  const techs = [
    'WordPress',
    'PHP',
    'WooCommerce',
    'React',
    'Next.js 12',
    'GraphQL',
    'react-query',
    'node.js',
    'Prisma',
    'MongoDB',
  ];
</script>

<ProjectCard
  title="trajesneopreno.es"
  id="tn"
  {techs}
  browser={tnBrowser}
  iphone={tnIphone}
>
  <p>
    La creé en 2014 como página nicho de afiliados. Creció hasta ser una guía
    completa sobre aguas abiertas y natación, con más de 30k visitas al mes y
    <strong>miles</strong> de lectores y suscriptores.
  </p>
  <p>
    También creé un comparador de ofertas (Next.js y Prisma), un grupo de FB con
    más de 15k usuarios, y un curso online. <strong
      >Vendí este negocio en jul-2023</strong
    >.
  </p>
  <SoldLabel />
</ProjectCard>
