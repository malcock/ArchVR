<script setup lang="ts">
defineProps<{
  label: string;
  error?: string;
}>();
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <slot />
    <div class="label" v-if="error">
      <span class="label-text-alt text-error">{{ error }}</span>
    </div>
  </label>
</template>

<style lang="postcss"></style>
