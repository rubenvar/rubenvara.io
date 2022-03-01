<script>
  // TODO doesn't fully work
  import { onMount } from "svelte";
  import random from "just-random-integer";

  let canvas;
  let ww;
  let wh;
  $: console.log(wh);
  onMount(() => {
    const ctx = canvas.getContext("2d");
    // ww = document.body.clientWidth;
    // wh = document.body.clientHeight;

    let triangles = [];

    // total of triangles relative to document height
    const amount = wh / 60;
    const mouse = { x: 0, y: 0 };
    const repelRadius = 100;

    canvas.width = ww;
    canvas.height = wh;

    // triangles are drawn inside a circle, all he calculations are respect a circle center (this.x, this.y)
    function Triangle() {
      // particles start somewhere random
      this.x = Math.random() * ww;
      this.y = Math.random() * wh;
      // destination
      // this.dest = { x, y };
      // tweak so destination is the same point where they start, so don't draw a word, just stay and repel the mouse
      this.dest = {
        x: this.x,
        y: this.y,
      };
      // radius
      this.r = Math.random() * 72 + 30;
      // how much it will move per render
      this.accX = 0;
      this.accY = 0;
      // how much it will move per render
      this.vx = (Math.random() - 0.5) * 20;
      this.vy = (Math.random() - 0.5) * 20;
      // friction, how much it bounces before getting to the end point
      // close to 1 but never 1 (or it wouldn't stop moving)
      this.friction = Math.random() * 0.03 + 0.96;

      // angles for triangles
      this.angle1 = Math.random() * Math.PI * 2;
      this.angle2 = Math.random() * Math.PI * 2;
      this.angle3 = Math.random() * Math.PI * 2;
    }

    Triangle.prototype.render = function () {
      // calculate how much it will move per render (bigger number when it's far)
      this.accX = (this.dest.x - this.x) / 1000;
      this.accY = (this.dest.y - this.y) / 1000;

      // what
      this.vx += this.accX;
      this.vy += this.accY;
      this.vx *= this.friction;
      this.vy *= this.friction;

      // move the thing: how much it moves each render
      // it takes into account where it was and where it goes to (with acc)
      // and a random "friction"
      this.x += this.vx;
      this.y += this.vy;

      // drawing circles
      // ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      // ctx.fill();

      ctx.strokeStyle = "#ddd";
      ctx.fillStyle = "#fcfcfc";
      // draw random triangle in a cricle
      // https://stackoverflow.com/questions/9879258/how-can-i-generate-random-points-on-a-circles-circumference-in-javascript
      ctx.beginPath();
      ctx.moveTo(
        this.x + Math.cos(this.angle1) * this.r,
        this.y + Math.sin(this.angle1) * this.r
      );
      ctx.lineTo(
        this.x + Math.cos(this.angle2) * this.r,
        this.y + Math.sin(this.angle2) * this.r
      );
      ctx.lineTo(
        this.x + Math.cos(this.angle3) * this.r,
        this.y + Math.sin(this.angle3) * this.r
      );
      ctx.fill();
      ctx.closePath();
      ctx.stroke();

      // keep the things always moving: randomly add or subtract a (very small) random number continously
      this.dest.x += Math.random() * 0.01 * random() > 0 ? 1 : -1;
      this.dest.y += Math.random() * 0.01 * random() > 0 ? 1 : -1;

      // bounce off borders
      if (this.x - this.r < 0) this.dest.x = this.x + this.r;
      if (this.y - this.r < 0) this.dest.y = this.y + this.r;
      if (this.x + this.r > ww) this.dest.x = this.x - this.r;
      if (this.y + this.r > wh) this.dest.y = this.y - this.r;

      // calculate distance from thing to cursor:
      // two sides of triangle (catetos)
      const a = this.x - mouse.x;
      const b = this.y - mouse.y;
      // distance = hipotenusa
      const distance = Math.sqrt(a * a + b * b);
      // check if it's close enough (depends on repel radius)
      if (distance < repelRadius) {
        this.accX = (this.x - mouse.x) / 100;
        this.accY = (this.y - mouse.y) / 100;
        this.vx += this.accX;
        this.vy += this.accY;
      }
    };

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }

    function onTouchEnd() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function initScene() {
      // canvas.width = ww;
      // canvas.height = wh;

      // clear to start rendering
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // create triangles
      triangles = [];
      for (let i = 0; i < amount; i++) {
        triangles.push(new Triangle());
      }
    }

    function render(t) {
      // console.log(t);
      frame = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      triangles.forEach((p) => p.render());
    }

    window.addEventListener("resize", initScene);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    initScene();
    let frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<div bind:clientHeight={wh} bind:clientWidth={ww}>
  <canvas bind:this={canvas} height={wh} width={ww}>fallback</canvas>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
