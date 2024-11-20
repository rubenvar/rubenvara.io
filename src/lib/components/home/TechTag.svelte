<script lang="ts">
  export let tech: string;

  const techName = tech
    .toLowerCase()
    .replace('.', '')
    .replace(/\s\d+/, '')
    .replace(' ', '-');
</script>

<span class="tag">
  <span class="dot" style="background-color: var(--{techName});"></span>
  {tech}
</span>

<style>
  .tag {
    color: var(--grey700);
    display: block;
    margin: 0;
    padding: var(--gap10) var(--gap20);
    background-color: var(--grey100);
    border-radius: var(--radius20);
    font-size: var(--fz20);
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
  }
</style>
