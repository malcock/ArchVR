<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: "md" | "sm" | "lg" | "xs" | "xl";
    items: any[];
  }>(),
  {
    size: "md",
  }
);
</script>

<template>
  <div
    class="grid gap-2"
    :class="{
      'grid-cols-8': size === 'xs',
      'grid-cols-6': size === 'sm',
      'grid-cols-4': size === 'md',
      'grid-cols-3': size === 'lg',
      'grid-cols-2': size === 'xl',
    }"
  >
    <template v-for="item in items">
      <slot name="item" v-bind="item"></slot>
    </template>
  </div>
</template>

<style></style>
