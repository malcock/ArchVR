<script setup lang="ts">
import { customAlphabet } from "nanoid";
import type { GraphIO } from "~/rete/types";

const nanoid = customAlphabet("1234567890abcdef", 16);

import type { SceneType, SceneWidgetType } from "~/server/trpc/routers/scene";
const props = defineProps<{ widget: SceneWidgetType }>();

const initialGraph = () => ({
  nodes: [
    {
      id: nanoid(),
      name: "Kpi Chart Output",
      data: {
        widgetId: props.widget.id,
      },
    },
  ],
  connections: [],
});
</script>

<template>
  <CoreWidget :widget="widget" :initial-graph="initialGraph"> Line </CoreWidget>
</template>

<style></style>
