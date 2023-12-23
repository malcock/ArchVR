<script setup lang="ts">
definePageMeta({
  auth: false,
});
</script>

<template>
  <div class="my-8">
    <Card title="Anyone can see this!">
      <template #title> Anyone can see this!</template>
      <template #content>Anyone at all!</template>
    </Card>
  </div>
</template>

<style lang="postcss"></style>
