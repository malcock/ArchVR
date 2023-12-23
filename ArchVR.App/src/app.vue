<script setup>
useHead({
  bodyAttrs: { class: "bg-gray-50 dark:bg-gray-950" },
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
