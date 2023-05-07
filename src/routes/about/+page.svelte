<script>
  import PageHeader from '$lib/components/PageHeader.svelte';
  import LastDecadeText from '$lib/components/LastDecadeText.svelte';
  import Emphasis from '$lib/components/Emphasis.svelte';

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
    'HTML',
    'Deno',
    'AWS SES',
    'Webpack',
    'Bun',
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

<p>
  Programo casi todos los días. Y algunos, casi no hago otra cosa. Cuando se me
  mete un nuevo proyecto en la cabeza, se me <strong>olvida</strong> todo lo demás.
</p>
<p>
  En 2015 me enamoré de <Emphasis type="js">JavaScript</Emphasis>, y desde
  entonces he creado decenas de webs, apps, servicios, <em>packages</em>.
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
<p>
  Siempre que descubro una herramienta, lenguaje o tecnología, intento <strong
    >crear un nuevo proyecto</strong
  > para poder aprenderlo o practicarlo.
</p>
<ul>
  <li>Desde el año pasado mi favorito es <code>SvelteKit</code>.</li>
  <li>
    Ahora mismo estoy practicando otros <em>frameworks</em> (<code>Qwik</code>,
    <code>SolidJS</code>, <code>Astro</code>, etc.)
  </li>
  <li>
    Lo siguiente que quiero aprender es <code>WebAssembly</code>. También quiero
    profundizar con <code>Bun</code> y <code>Deno</code>.
  </li>
</ul>

<h2>También hago otras cosas</h2>
<p>
  Aunque me pase muchas horas sentado, intento sacar tiempo a diario para
  <strong>escalar</strong>, nadar, hacer yoga o calistenia, o correr por el
  monte.
</p>
<p>
  También trato de <strong>leer</strong> todos los días. Casi todo tipo de novela
  del siglo XX me interesa, pero me inclino hacia el surrealismo.
</p>
<p>
  A todas horas, <strong>música</strong>: todos los años Spotify me dice en su
  <em>wrapped</em> que he escuchado más minutos que el 99,5% de los usuarios en España.
</p>
<p>
  Y cuando saco tiempo, intento dividirlo entre muchos otros <strong
    >hobbies</strong
  >: jardinería (aromáticas sobre todo), craft beer, cocina (los fermentados me
  interesan mucho), conducir, pasear al sol, la fotografía, aprender ruso o
  japonés.
</p>

<LastDecadeText />

<style lang="scss">
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap20) var(--gap30);
    margin: var(--gap30) 0;
    --custom-color: var(--grey200);
    span {
      font-family: var(--codeFont);
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
