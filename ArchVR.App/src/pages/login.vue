<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
</script>

<template>
  <div class="w-64">
    <Suspense>
      <AuthLoginForm />
    </Suspense>
  </div>
</template>

<style lang="postcss"></style>
