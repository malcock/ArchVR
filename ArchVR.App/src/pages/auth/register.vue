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
  <div class="my-8">
    <Suspense>
      <RegisterFormVue />
    </Suspense>
  </div>
</template>

<style></style>
