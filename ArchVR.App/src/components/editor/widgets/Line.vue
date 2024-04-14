<script setup lang="ts">
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import VChart, { THEME_KEY } from "vue-echarts";
use([GridComponent, LineChart, CanvasRenderer]);
provide(THEME_KEY, "dark");

const chart = ref<InstanceType<typeof VChart>>();

import { customAlphabet } from "nanoid";
import type { GraphIO } from "~/GraphManager/types";

const nanoid = customAlphabet("1234567890abcdef", 16);

import type { SceneType, SceneWidgetType } from "~/server/trpc/routers/scene";
import type { EChartsOption } from "echarts";
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

const dataHistory = ref<{ name: string; value: any }[]>([]);

const gotData = (d: any) => {
  const now = new Date();
  const newD = {
    name: now.toString(),
    value: [now.toISOString(), d.data],
  };
  dataHistory.value.push(newD);
  if (dataHistory.value.length > 99) dataHistory.value.shift();
  if (chart.value)
    chart.value.setOption({
      series: {
        data: dataHistory.value,
      },
    });
};

const options = ref<EChartsOption>({
  xAxis: {
    type: "time",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [],
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
});
</script>

<template>
  <CoreWidget
    :widget="widget"
    :initial-graph="initialGraph"
    @data-received="gotData"
  >
    <client-only>
      <v-chart ref="chart" class="chart h-32" :option="options" />
    </client-only>
  </CoreWidget>
</template>

<style></style>
