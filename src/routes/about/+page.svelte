<script>
  import PageHeader from '$lib/components/PageHeader.svelte';
  import LastDecadeText from '$lib/components/LastDecadeText.svelte';

  const techs = [
    'JavaScript',
    'Node.js',
    'React',
    'Svelte',
    'Next.js',
    'CSS',
    'TypeScript',
    'GraphQL',
    'Express.js',
    'Sass',
    'Prisma',
    'SvelteKit',
    'MongoDB',
    'AWS Lambda',
    'Tanstack Query',
    'PHP',
    'tRPC',
    'Fastify',
    'KeystoneJS',
    'REST',
    'Vite',
    'WordPress',
    'Gatsby',
    'JSON',
    'Parcel',
    'AWS SES',
    'Webpack',
    'ESLint',
    'WooCommerce',
    'Stripe',
    'Firebase',
    'SolidJS',
    'Qwik',
    'Leaflet',
    'D3',
    'Supabase',
    'Hugo',
  ];
</script>

<PageHeader title="Sobre mí" />
<p>Ampliar hobbies de la home.</p>
<p>
  música, idiomas, cocina, fermentados, jardinería, invernadero, aromáticas,
  lectura, novela negra, clásicos siglo XX
</p>
<p>FOTO</p>

<h2>También programo</h2>
<p>
  Programo casi todos los días, gran parte del día, realmente. Desde 2015 he
  creado decenas de webs, apps, servicios, *packages*.
</p>
<p>
  Básicamente, cualquier cosa que pueda surgir combinando
  <span class="tags">
    {#each techs as tech}
      <span
        style="--custom-color: var(--{tech
          .toLowerCase()
          .replace('.', '')
          .replace(/\s\d+/, '')
          .replace(' ', '-')})">{tech}</span
      >
    {/each}
  </span>
  y otros.
</p>

<LastDecadeText />

<style lang="scss">
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap30) var(--gap40);
    margin: var(--gap30) 0;
    --custom-color: var(--grey200);
    span {
      font-size: var(--fz20);
      border: 1px solid var(--grey200);
      line-height: 1.6;
      background-color: var(--grey200);
      padding: 0 calc(var(--gap20) - 1px);
      border-radius: var(--radius10);
      transition: border-color 0.9s;
      &:hover {
        transition: border-color 0.25s;
        border-color: var(--custom-color);
      }
    }
  }
</style>
