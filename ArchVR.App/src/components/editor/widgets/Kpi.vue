<script setup lang="ts">
import { customAlphabet } from "nanoid";
import type { GraphIO } from "~/GraphManager/types";

const nanoid = customAlphabet("1234567890abcdef", 16);

import type { SceneType, SceneWidgetType } from "~/server/trpc/routers/scene";
const props = defineProps<{ widget: SceneWidgetType }>();

const initialGraph = () => ({
  nodes: [
    {
      id: nanoid(),
      name: "Widget Output",
      data: {
        widgetId: props.widget.id,
      },
    },
  ],
  connections: [],
});

const data = ref<any>(null);

const gotData = (d: any) => {
  data.value = d;
};

const display = computed(() => {
  return data.value && data.value.data && typeof data.value.data === "number"
    ? data.value.data.toFixed(2)
    : data.value;
});
</script>

<template>
  <CoreWidget
    :widget="widget"
    :initial-graph="initialGraph"
    @data-received="gotData"
  >
    <p class="text-3xl">{{ display }}</p>
  </CoreWidget>
</template>

<style></style>
