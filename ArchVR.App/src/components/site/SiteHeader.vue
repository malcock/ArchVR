<script lang="ts" setup>
import AuthMenuVue from "./AuthMenu.vue";
</script>

<template>
  <header class="base-200 border-b-red-700 border-b mb-8">
    <div class="container flex py-4 mx-auto">
      <NuxtLink to="/" class="text-red-700 font-bold">Home</NuxtLink>
      <ul class="menu flex ml-auto space-x-4">
        <li><NuxtLink to="/profile"> Profile page</NuxtLink></li>
        <li>Another page</li>
        <li>One more</li>
      </ul>
      <AuthMenuVue />
    </div>
  </header>
</template>

<style></style>
