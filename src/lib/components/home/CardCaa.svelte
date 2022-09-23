<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  // import { fade } from 'svelte/transition';
  // import { goto } from '$app/navigation';
  // import TechTag from './TechTag.svelte';
  // let showBig = false;

  // const close = () => {
  //   showBig = false;
  //   goto('#button-caa');
  // };

  // const handleClick = () => {
  //   showBig = !showBig;
  //   if (showBig) goto('#card-caa');
  // };

  const techs = [
    'React',
    'Next.js 12',
    'Typescript',
    'GraphQL',
    'react-query',
    'graphql-codegen',
    'KeystoneJS 5',
    'node.js',
    'MongoDB',
  ];
</script>

<ProjectCard id="caa" title="calendarioaguasabiertas.com" {techs}>
  <div slot="text">
    <p>
      Un mega-listado de todas las travesías de natación en el estado, y el
      proyecto del que más orgulloso estoy. Visitado por cientos de personas
      cada día.
    </p>
    <p>
      He añadido decenas de funciones desde su creación, hace más de 2 años. He
      aprendido muchísimo trabajando en ello, y sigo teniendo nuevos retos a
      diario.
    </p>
    <p>
      A partir de este he creado varias herramientas extra, como un <em
        >scraper</em
      > o una app de gestión de contactos, ambas con SvelteKit, con bases de datos
      y autenticación en Supabase.js.
    </p>
  </div>
  <div slot="stats">some easy easy easy stats here</div>
  <p slot="short">
    Un mega-listado de todas las travesías de natación en el estado, y el
    proyecto del que más orgulloso estoy. Visitado por cientos de personas cada
    día.
  </p>
</ProjectCard>
