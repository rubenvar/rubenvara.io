<script lang="ts">
  export let tech: string;
  
  const cl = tech
    .toLowerCase()
    .replace('.', '')
    .replace(/\s\d+/, '')
    .replace(' ', '-');
</script>

<span class="tag"><span class="dot {cl}" />{tech}</span>

<style lang="scss">
  .tag {
    color: var(--grey700);
    display: block;
    margin-bottom: var(--gap40);
    padding: var(--gap10) var(--gap20);
    background-color: #fffa;
    border-radius: var(--radius20);
  }
  .dot {
    display: inline-block;
    vertical-align: middle;
    margin-right: var(--gap20);
    margin-bottom: var(--gap10);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: black;
    &.svelte,
    &.sapper,
    &.sveltekit {
      background-color: var(--svelte);
    }
    &.netlify {
      background-color: var(--netlify);
    }
    &.vanillajs {
      background-color: var(--vanillajs);
    }
    &.vanillajs {
      background-color: var(--vanillajs);
    }
    &.scss {
      background-color: var(--scss);
    }
    &.pug {
      background-color: var(--pug);
    }
    &.parcel {
      background-color: var(--parcel);
    }
    &.express {
      background-color: var(--express);
    }
    &.mongoose {
      background-color: var(--mongoose);
    }
    &.webpack {
      background-color: var(--webpack);
    }
    &.aws-lambda {
      background-color: var(--aws-lambda);
    }
    &.digitalocean {
      background-color: var(--digitalocean);
    }
    &.react {
      background-color: var(--react);
    }
    &.nextjs {
      background-color: var(--nextjs);
    }
    &.typescript {
      background-color: var(--typescript);
    }
    &.graphql {
      background-color: var(--graphql);
    }
    &.react-query {
      background-color: var(--react-query);
    }
    &.graphql-codegen {
      background-color: var(--graphql-codegen);
    }
    &.keystonejs {
      background-color: var(--keystonejs);
    }
    &.nodejs {
      background-color: var(--nodejs);
    }
    &.mongodb {
      background-color: var(--mongodb);
    }
    &.prisma {
      background-color: var(--prisma);
    }
    &.wordpress {
      background-color: var(--wordpress);
    }
    &.php {
      background-color: var(--php);
    }
  }
</style>
