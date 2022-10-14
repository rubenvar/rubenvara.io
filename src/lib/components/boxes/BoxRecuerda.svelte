<script lang="ts">
  // let size = 1;

  function handleClick() {
    console.log('what');

    // size = size + 1;
  }
</script>

<div class="box recuerda">
  <button on:click={handleClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-radioactive"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M13.5 14.6l3 5.19a9 9 0 0 0 4.5 -7.79h-6a3 3 0 0 1 -1.5 2.6" />
      <path d="M13.5 9.4l3 -5.19a9 9 0 0 0 -9 0l3 5.19a3 3 0 0 1 3 0" />
      <path d="M10.5 14.6l-3 5.19a9 9 0 0 1 -4.5 -7.79h6a3 3 0 0 0 1.5 2.6" />
    </svg>
  </button>
  <slot />
</div>

<style lang="scss">
  .box {
    position: relative;
    button {
      position: absolute;
      right: var(--gap60);
      top: var(--gap60);
    }
  }
  svg {
    border: 1px solid;
    stroke: var(--announce600);
    transition: transform 0.2s;
    cursor: pointer;
    /* &:hover {
      transform: scale(0.95);
    } */
  }
</style>
