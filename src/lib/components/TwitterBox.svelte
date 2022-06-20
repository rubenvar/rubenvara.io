<script lang="ts">
  export let twitter: string | undefined;
</script>

<div>
  {#if twitter}
    <p>
      Ya estamos hablando sobre esto en Twitter. Deja tu opinión en <a
        href={twitter}
        target="_blank">el hilo sobre el tema</a
      >.
    </p>
  {:else}
    <p>
      ¿Tienes dudas o quieres aportar algo al artículo? <a
        href="https://www.twitter.com/rubenvara01"
        target="_blank">Escríbeme en Twitter</a
      > y cuéntame!
    </p>
  {/if}
</div>

<style lang="scss">
  div {
    margin-top: var(--gap70);
    /* TODO use twitter colors here, logo, etc. as I did the original idea */
    border: 3px solid paleturquoise;
    border-radius: var(--radius30);
    padding: var(--gap30);
    p {
      color: var(--grey700);
      margin: 0;
    }
  }
</style>
