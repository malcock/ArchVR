<script lang="ts" setup>
const { lastRefreshedAt, status, data, signOut } = useAuth();

const isAuthenticated = computed(() => status.value === "authenticated");
</script>

<template>
  <div class="auth ml-16">
    <template v-if="isAuthenticated">
      <div class="avatar"></div>
      <NuxtLink @click="signOut()">Sign out</NuxtLink>
    </template>
    <div class="space-x-4" v-else>
      <NuxtLink to="/login">Sign in</NuxtLink>
      <NuxtLink to="/register">Sign up</NuxtLink>
    </div>
  </div>
</template>

<style></style>
