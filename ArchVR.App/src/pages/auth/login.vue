<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
</script>

<template>
  <div class="my-8">
    <Suspense>
      <AuthLoginForm />
    </Suspense>
  </div>
</template>

<style></style>
