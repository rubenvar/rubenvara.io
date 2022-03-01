<script>
  import { browser } from "$app/env";
  // import { onMount } from "svelte";
  import { Canvas, Layer, t } from "svelte-canvas";

  $: ww = browser ? document.body.clientWidth : 640;
  $: wh = browser ? document.body.clientHeight : 640;

  $: console.log(wh);

  $: render = ({ context, width, height }) => {
    context.fillStyle = `hsl(${$t / 40}, 100%, 50%)`;
    context.beginPath();
    context.arc(($t / 4) % width, ($t / 4) % height, 100, 0, Math.PI * 2);
    context.fill();
  };
</script>

<Canvas style="position: absolute" width={ww} height={wh}>
  <Layer {render} />
</Canvas>
