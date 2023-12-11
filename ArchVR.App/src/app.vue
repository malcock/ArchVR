<script setup>
useHead({
  bodyAttrs: { class: "base-100" },
});
</script>
<template>
  <div>
    <SiteHeader />
    <div class="container mx-auto">
      <NuxtPage />
    </div>
  </div>
</template>
