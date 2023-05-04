<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';

  const techs = [
    'WordPress',
    'PHP',
    'React',
    'Next.js 12',
    'GraphQL',
    'react-query',
    'node.js',
    'Prisma',
    'MongoDB',
  ];
</script>

<ProjectCard title="trajesneopreno.es" id="tn" {techs}>
  <p>
    La creé en 2014 como página nicho de afiliados. Ahora es una guía completa
    sobre aguas abiertas y natación, con más de 30k visitas al mes y
    <strong>miles</strong> de lectores y suscriptores.
  </p>
  <p>
    A su alrededor he creado un comparador de ofertas en Next.js y Prisma, un
    grupo de FB con más de 15k usuarios, y un programa online en venta.
  </p>
</ProjectCard>
