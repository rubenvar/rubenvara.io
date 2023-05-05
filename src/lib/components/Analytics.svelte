<script lang="ts">
  import { page } from '$app/stores';

  // add both properties maybe?
  $: {
    if (typeof gtag !== 'undefined') {
      // // eslint-disable-next-line no-undef
      // gtag('config', 'UA-54909104-9', {
      //   page_title: document.title,
      //   page_path: $page.url.pathname,
      // });
      // eslint-disable-next-line no-undef
      gtag('config', 'G-LPH1220C03', {
        page_title: document.title,
        page_path: $page.url.pathname,
      });
    }
  }
</script>

<svelte:head>
  <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=UA-54909104-9"></script> -->
  <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=UA-54909104-9"></script> -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-LPH1220C03"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    // gtag('config', 'UA-54909104-9');
    gtag('config', 'G-LPH1220C03');
  </script>
</svelte:head>
