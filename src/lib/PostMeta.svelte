<script>
  import dayjs from "dayjs";
  import "dayjs/locale/es.js";

  export let inBottom;
  export let inFullPost;
  export let date;
  export let categories;

  const dateFormat = inFullPost ? "D [de] MMMM, YYYY" : "MMMM YYYY";
</script>

<p class="post-meta" class:in-bottom={inBottom}>
  <span>
    <time dateTime={date}>
      {dayjs(date).locale("es").format(dateFormat)}
    </time>
  </span>
  <span class="cats">
    {#each categories as cat}
      <span>#{cat.toLowerCase()}</span>
    {/each}
  </span>
</p>

<style lang="scss">
  .post-meta {
    margin: 0;
    display: flex;
    justify-content: space-between;
    gap: var(--gap40);
    color: var(--grey500);
    font-size: var(--fontSize30);
    &.in-bottom {
      margin-top: var(--gap90);
    }
    .cats {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      span {
        margin: 0 var(--gap20) 0 0;
      }
    }
  }
</style>
