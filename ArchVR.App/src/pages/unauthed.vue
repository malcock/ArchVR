<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
</script>

<template>
  <Card>
    <template #title>Unauthed only!</template>
    <template #content>This is only for unauthenticated users only!</template>
  </Card>
</template>

<style lang="postcss"></style>
