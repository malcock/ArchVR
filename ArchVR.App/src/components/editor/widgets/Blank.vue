<script setup lang="ts">
import { customAlphabet } from "nanoid";
import type { SceneType, SceneWidgetType } from "~/server/trpc/routers/scene";

const props = defineProps<{ widget: SceneWidgetType }>();
const nanoid = customAlphabet("1234567890abcdef", 16);
const initialGraph = () => ({
  nodes: [],
  connections: [],
});
</script>

<template>
  <CoreWidget :widget="widget" :initial-graph="initialGraph">
    <p class="widget-blank">Blank</p>
  </CoreWidget>
</template>

<style>
.widget-blank {
  @apply absolute inset-0 grid place-items-center text-xs;
  color: var(--ink-dim);
}
</style>
