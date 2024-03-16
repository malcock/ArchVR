<script setup lang="ts">
import type { SceneType, SceneWidgetType } from "~/server/trpc/routers/scene";
const props = defineProps<{ widget: SceneWidgetType }>();
</script>

<template>
  <CoreWidget :name="widget.name" :position="widget.position"> KPI </CoreWidget>
</template>

<style></style>
