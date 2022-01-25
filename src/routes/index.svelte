<script>
  import HomeText from "$lib/HomeText.svelte";

  // separate the letters
  const letters = Array.from("Rubén Vara");
</script>

<h1>
  {#each letters as letter}
    <span class={letter === " " ? "💩" : `🚀 ${letter}`}>
      {letter}
    </span>
  {/each}
</h1>
<p class="bigger">Desarollo páginas web naturales, rápidas y modernas</p>
<p>
  En los ratos libres escalo todo lo que puedo, leo, dibujo, y trabajo en más
  proyectos web.
</p>

<HomeText />

<style lang="scss">
  @keyframes changeColor {
    0% {
      color: var(--primary400);
    }
    20% {
      color: var(--primary700);
    }
    40% {
      color: var(--primary600);
    }
    60% {
      color: var(--primary400);
    }
    80% {
      color: var(--primary700);
    }
    100% {
      color: var(--primary500);
    }
  }
  h1 {
    font-family: var(--logoFont);
    font-size: var(--fontSize150);
    /* letter-spacing: -1px; */
    color: var(--primary500);
    /* this would chose a color randomly for each letter, could be done in js? */
    /* color: var(--${randomColor}); */
    @media only screen and (min-width: 780px) {
      animation: changeColor 11s infinite alternate;
    }
    span {
      &.🚀 {
        display: inline-block;
        transition: all 0.4s;
        &:hover {
          transform: translateY(-20px);
          &:nth-child(4) {
            transform: translateY(-20px) translateX(-6px) rotate(-23deg);
          }
          &:nth-child(10) {
            transform: translateY(19px) translateX(6px) rotate(33deg);
          }
        }
      }
      &.V {
        letter-spacing: -4px;
      }
    }
  }
  .bigger {
    font-size: var(--fontSize50);
  }
</style>
