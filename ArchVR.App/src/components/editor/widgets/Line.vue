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
  if (dataHistory.value.length > 399) dataHistory.value.shift();
  if (chart.value)
    chart.value.setOption({
      series: {
        data: dataHistory.value,
      },
    });
};

// canvas can't read CSS variables; these mirror theme.css
const SIGNAL = "#5cc8f2";
const INK_DIM = "#8a93a1";
const HAIRLINE = "rgba(255, 255, 255, 0.08)";

const options = ref<EChartsOption>({
  backgroundColor: "transparent",
  animation: false,
  textStyle: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif' },
  xAxis: {
    type: "time",
    splitNumber: 3,
    axisLine: { lineStyle: { color: HAIRLINE } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: {
      color: INK_DIM,
      fontSize: 10,
      hideOverlap: true,
      formatter: "{HH}:{mm}:{ss}",
    },
  },
  yAxis: {
    type: "value",
    splitNumber: 3,
    axisLabel: { color: INK_DIM, fontSize: 10 },
    splitLine: { lineStyle: { color: HAIRLINE } },
  },
  series: [
    {
      data: [],
      type: "line",
      smooth: false,
      showSymbol: false,
      lineStyle: { width: 1.5, color: SIGNAL },
      itemStyle: { color: SIGNAL },
      areaStyle: {
        origin: "start",
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(92, 200, 242, 0.2)" },
            { offset: 1, color: "rgba(92, 200, 242, 0)" },
          ],
        },
      },
    },
  ],
  grid: {
    top: 10,
    bottom: 6,
    left: 8,
    right: 12,
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
      <v-chart ref="chart" class="widget-chart" :option="options" autoresize />
    </client-only>
  </CoreWidget>
</template>

<style>
.widget-chart {
  position: absolute;
  inset: 0;
}
</style>
