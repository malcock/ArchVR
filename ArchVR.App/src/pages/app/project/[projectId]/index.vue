<script setup lang="ts">
const route = useRoute();

const { projectId } = route.params;
</script>

<template>
  <div class="my-8">
    <ProjectSceneList :projectId="(projectId as string)" />
  </div>
</template>

<style lang="postcss"></style>
