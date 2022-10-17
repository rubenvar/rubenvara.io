---
title: Probando las boxes
date: 2022-10-07
status: draft
---

<script>
  import Box from '$lib/components/Box.svelte';
  import Emphasis from '$lib/components/Emphasis.svelte';
</script>

<Box>

Box <Emphasis>normal</Emphasis> o **info**, que es lo mismo.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, qui nemo? Sapiente nihil reiciendis reprehenderit quam excepturi dolorem modi perferendis ea, qui unde commodi. Molestiae nemo sed perspiciatis minus neque. Sit sunt

- Molestiae nemo sed perspiciatis minus neque. Sit sunt
- iunt vero totam, adipisci voluptatem corporis assumenda quisquam recusandae
- nemo sed perspiciatis minus neque. Sit suntMolestiae
- assumenda quisquam  iunt vero totam, adipisci voluptatem corporis

</Box>

<Box type="recuerda">

### Box recuerda

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, qui nemo? Sapiente nihil reiciendis reprehenderit quam excepturi dolorem modi perferendis ea, qui unde commodi. Molestiae nemo sed perspiciatis minus neque. Sit sunt

ipsa rem dolores est!

</Box>

<Box type="updated">

**Updated**:

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, qui nemo? Sapiente nihi

### Box updated

ducimus reprehenderit earum voluptatibus in dolorem nesciunt vero totam, adipisci voluptatem c

</Box>

<Box type="translated">

Translated Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, [qui nemo? Sapiente nihi](https://rubenvara.io) ducimus reprehenderit earum voluptatibus in dolorem nesciunt vero totam, adipisci voluptatem c.

</Box>

<Box type="inventado">

Este tipo no existe

Translated Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, [qui nemo? Sapiente nihi](https://rubenvara.io) ducimus reprehenderit earum voluptatibus in dolorem nesciunt vero totam, adipisci voluptatem c.

</Box>
