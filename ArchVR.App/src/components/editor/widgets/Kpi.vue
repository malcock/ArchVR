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
  return typeof data.value?.data === "number"
    ? data.value.data.toFixed(2)
    : null;
});
</script>

<template>
  <CoreWidget
    :widget="widget"
    :initial-graph="initialGraph"
    @data-received="gotData"
  >
    <p class="widget-kpi" :class="{ 'is-idle': display === null }">
      {{ display ?? "No data yet" }}
    </p>
  </CoreWidget>
</template>

<style>
.widget-kpi {
  @apply absolute inset-0 flex items-center px-3 font-semibold truncate;
  color: var(--ink-strong);
  font-size: 2.25rem;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;

  &.is-idle {
    @apply font-normal tracking-normal;
    color: var(--ink-dim);
    font-size: 0.75rem;
  }
}
</style>
