<script setup lang="ts">
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";
import type { EChartsOption } from "echarts";
import type { SceneWidgetType } from "~/server/trpc/routers/scene";
import {
  SERIES,
  INK_DIM,
  HAIRLINE,
  FONT,
  axisLabel,
  tooltip,
  formatValue,
} from "~/config/chartTheme";

use([
  GridComponent,
  LegendComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
]);
provide(THEME_KEY, "dark");

const props = defineProps<{ widget: SceneWidgetType }>();
const initialGraph = useWidgetOutputGraph(props.widget);

const chart = ref<InstanceType<typeof VChart>>();

const WINDOW = 240;
const COMPONENTS = ["x", "y", "z", "w"];
const history: [string, number][][] = COMPONENTS.map(() => []);
const hasData = ref(false);

const lineSeries = (name: string, i: number, data: [string, number][]) => ({
  name,
  type: "line" as const,
  showSymbol: false,
  lineStyle: { width: 1.5, color: SERIES[i] },
  itemStyle: { color: SERIES[i] },
  data,
});

// a vector arrives as a Vector; a plain number is drawn as a single series
const toComponents = (value: any): number[] => {
  if (typeof value === "number") return [value];
  if (typeof value?.toArray === "function") return value.toArray();
  return [];
};

const gotData = (d: { data: unknown }) => {
  const values = toComponents(d.data).slice(0, COMPONENTS.length);
  if (!values.length) return;
  hasData.value = true;

  const now = new Date().toISOString();
  values.forEach((v, i) => {
    history[i].push([now, v]);
    if (history[i].length > WINDOW) history[i].shift();
  });

  chart.value?.setOption({
    series: values.map((_, i) => lineSeries(COMPONENTS[i], i, history[i])),
  });
};

const options = ref<EChartsOption>({
  backgroundColor: "transparent",
  animation: false,
  textStyle: { fontFamily: FONT },
  legend: {
    top: 4,
    left: 8,
    itemWidth: 10,
    itemHeight: 2,
    itemGap: 10,
    icon: "rect",
    textStyle: { color: INK_DIM, fontSize: 10 },
  },
  tooltip: {
    ...tooltip,
    trigger: "axis",
    axisPointer: { lineStyle: { color: HAIRLINE } },
    valueFormatter: (v) => (typeof v === "number" ? formatValue(v) : "–"),
  },
  xAxis: {
    type: "time",
    splitNumber: 3,
    axisLine: { lineStyle: { color: HAIRLINE } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { ...axisLabel, hideOverlap: true, formatter: "{HH}:{mm}:{ss}" },
  },
  yAxis: {
    type: "value",
    splitNumber: 3,
    axisLabel,
    splitLine: { lineStyle: { color: HAIRLINE } },
  },
  series: [],
  grid: { top: 26, bottom: 6, left: 8, right: 12, containLabel: true },
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
    <p v-if="!hasData" class="widget-blank">No data yet</p>
  </CoreWidget>
</template>
