<script lang="ts" setup>
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
      <AuthForgottenPasswordForm />
    </Suspense>
  </div>
</template>

<style></style>
