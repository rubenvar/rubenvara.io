<script lang="ts">
  import IconGithub from '$lib/components/icons/IconGithub.svelte';
  import IconLinkedin from '$lib/components/icons/IconLinkedin.svelte';
  import IconTwitter from '$lib/components/icons/IconTwitter.svelte';
  import IconMail from '$lib/components/icons/IconMail.svelte';
  import { dev } from '$app/environment';
</script>

<p>Puedes encontrarme por aquí:</p>
<div class="links">
  <a href="https://github.com/rubenvar/" target="_blank"><IconGithub />GitHub</a
  >
  <a href="https://www.linkedin.com/in/rubenvara" target="_blank"
    ><IconLinkedin />LinkedIn</a
  >
  {#if dev}<a href="https://twitter.com/rubenvara01" target="_blank"
      ><IconTwitter />Twitter</a
    >{/if}
  <a href="mailto:hey@rubenvara.io"><IconMail />Contacto</a>
</div>

<style lang="scss">
  p {
    margin-top: 0;
    margin-bottom: var(--gap40);
    color: var(--grey700);
  }
  div {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: var(--gap80);
    gap: var(--gap40);
    flex-wrap: wrap;
    a {
      text-decoration: none;
    }
  }
</style>
