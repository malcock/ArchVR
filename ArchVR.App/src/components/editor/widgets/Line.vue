<script setup lang="ts">
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import VChart, { THEME_KEY } from "vue-echarts";
use([GridComponent, LineChart, CanvasRenderer]);
provide(THEME_KEY, "dark");

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

const dataHistory = ref<{ t: number; d: any }[]>([]);

const gotData = (d: any) => {
  const newD = { t: Date.now(), d: d.data };
  dataHistory.value.push(newD);
  if (dataHistory.value.length > 99) dataHistory.value.shift();
};

const options = computed(() => {
  return {
    xAxis: {
      type: "category",
      data: dataHistory.value.map((x) => x.t),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: dataHistory.value.map((x) => x.d),
        type: "line",
        smooth: false,
      },
    ],
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      containLabel: true, // This ensures that labels are inside the chart area
    },
  };
});
</script>

<template>
  <CoreWidget
    :widget="widget"
    :initial-graph="initialGraph"
    @data-received="gotData"
  >
    <client-only>
      <v-chart class="chart h-32" :option="options" />
    </client-only>
  </CoreWidget>
</template>

<style></style>
