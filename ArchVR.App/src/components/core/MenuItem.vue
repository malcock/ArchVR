<script setup lang="ts">
export interface MenuItem {
  label: string;
  url?: string;
  action?: Function;
  children?: MenuItem[];
}
const props = defineProps<{
  item: MenuItem;
}>();
</script>

<template>
  <li>
    <template v-if="item.children && item.children.length > 0">
      <details>
        <summary>{{ item.label }}</summary>
        <ul>
          <MenuItem v-for="i in item.children" :item="i" />
        </ul>
      </details>
    </template>
    <template v-else>
      <NuxtLink v-if="item.url" :to="item.url">{{ item.label }}</NuxtLink>
      <a v-else-if="item.action" @click="item.action">{{ item.label }}</a>
      <a v-else>{{ item.label }}</a>
    </template>
  </li>
</template>

<style></style>
