<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size: "md" | "sm" | "lg" | "xs" | "xl";
  }>(),
  { size: "md" }
);
</script>

<template>
  <span class="icon" :class="{ 'text-sm': props.size === 'sm' }">
    <slot />
  </span>
</template>

<style></style>
