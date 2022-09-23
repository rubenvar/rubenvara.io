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
  <div slot="text">
    <p>
      Empezó siendo una página nicho de afiliados, ahora es una guía
      completísima sobre aguas abiertas y natación con más de 30k visitas al mes
      y miles de lectores y suscriptores.
    </p>
    <p>
      A partir de esta he creado otros proyectos distintos para la comunidad:
    </p>
    <ul>
      <li>
        Un comparador de ofertas con backend node.js (Prisma) y frontend
        Next.js.
      </li>
      <li>Un grupo de FB con más de 11k usuarios.</li>
      <li>Un programa online que también tengo a la venta.</li>
    </ul>
    <p>Acabo con algo curioso</p>
  </div>
  <div slot="stats">
    <p>some stats text</p>
    <ul>
      <li>stats</li>
      <li>stats</li>
    </ul>
  </div>
  <p slot="short">
    Empezó siendo una página nicho de afiliados, ahora es una guía completísima
    sobre aguas abiertas y natación con más de 30k visitas al mes y miles de
    lectores y suscriptores.
  </p>
</ProjectCard>
