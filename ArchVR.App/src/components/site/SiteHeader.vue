<script lang="ts" setup>
import AuthMenuVue from "./AuthMenu.vue";

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    url: "/",
  },
  {
    label: "Protected Page",
    icon: "pi pi-star",
    url: "/app",
  },
  {
    label: "Unprotected",
    icon: "pi pi-star",
    url: "/unprotected",
  },
  {
    label: "Unauthed only",
    icon: "pi pi-star",
    url: "/unauthed",
  },
  {
    label: "Profile",
    icon: "pi pi-star",
    url: "/auth/profile",
  },
]);
</script>

<template>
  <Menubar :model="items" class="w-full justify-between">
    <!-- <template #item="{ item, props, hasSubmenu, root }"> -->
    <template #end>
      <AuthMenuVue />
    </template>
  </Menubar>

  <!-- <header class="base-200 border-b-red-700 border-b mb-8">
    <div class="container flex py-4 mx-auto">
      <NuxtLink to="/" class="text-red-700 font-bold">Home</NuxtLink>
      <ul class="menu flex ml-auto space-x-4">
        <li><NuxtLink to="/auth/profile"> Profile page</NuxtLink></li>
        <li><NuxtLink to="/protected">Another page</NuxtLink></li>
        <li>One more</li>
      </ul>
      <AuthMenuVue />
    </div>
  </header> -->
</template>

<style></style>
