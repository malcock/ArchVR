<script lang="ts" setup>
import RegisterFormVue from "~/components/auth/RegisterForm.vue";
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
</script>

<template>
  <Suspense>
    <RegisterFormVue />
  </Suspense>
</template>

<style></style>
