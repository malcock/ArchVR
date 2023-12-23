<script lang="ts" setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
const route = useRoute();

const { token } = route.params;
</script>

<template>
  <div class="my-8">
    <Suspense>
      <AuthNewPasswordForm :token="(token as string)" is-reset />
    </Suspense>
  </div>
</template>

<style></style>
