<script setup lang="ts">
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";
import type { EChartsOption } from "echarts";
import type { SceneWidgetType } from "~/server/trpc/routers/scene";
import {
  SIGNAL,
  HAIRLINE,
  FONT,
  axisLabel,
  tooltip,
  formatValue,
} from "~/config/chartTheme";

use([GridComponent, TooltipComponent, BarChart, CanvasRenderer]);
provide(THEME_KEY, "dark");

const props = defineProps<{ widget: SceneWidgetType }>();
const initialGraph = useWidgetOutputGraph(props.widget);

const chart = ref<InstanceType<typeof VChart>>();

const WINDOW = 400;
const BINS = 14;
const samples: number[] = [];
const unit = ref("");
const hasData = ref(false);

const gotData = (d: { data: unknown; unit?: string }) => {
  if (typeof d.unit === "string") unit.value = d.unit;
  if (typeof d.data !== "number") return;
  samples.push(d.data);
  if (samples.length > WINDOW) samples.shift();
  hasData.value = true;
};

// samples can arrive every frame; re-bin a few times a second instead
useIntervalFn(() => {
  if (!chart.value || samples.length < 2) return;
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const width = (max - min) / BINS || 1;
  const counts = new Array(BINS).fill(0);
  for (const s of samples) {
    counts[Math.min(BINS - 1, Math.floor((s - min) / width))]++;
  }
  chart.value.setOption({
    xAxis: { data: counts.map((_, i) => formatValue(min + i * width)) },
    series: [
      {
        data: counts.map((count, i) => ({
          value: count,
          from: min + i * width,
          to: min + (i + 1) * width,
        })),
      },
    ],
  });
}, 300);

const options = ref<EChartsOption>({
  backgroundColor: "transparent",
  animation: false,
  textStyle: { fontFamily: FONT },
  tooltip: {
    ...tooltip,
    trigger: "item",
    formatter: (p: any) =>
      `${formatValue(p.data.from)} to ${formatValue(p.data.to)}${
        unit.value ? " " + unit.value : ""
      }<br /><b>${p.data.value}</b> of the last ${samples.length} samples`,
  },
  xAxis: {
    type: "category",
    data: [],
    axisLine: { lineStyle: { color: HAIRLINE } },
    axisTick: { show: false },
    axisLabel: { ...axisLabel, hideOverlap: true },
  },
  yAxis: {
    type: "value",
    splitNumber: 2,
    minInterval: 1,
    axisLabel,
    splitLine: { lineStyle: { color: HAIRLINE } },
  },
  series: [
    {
      type: "bar",
      data: [],
      barCategoryGap: "14%",
      itemStyle: { color: SIGNAL, borderRadius: [3, 3, 0, 0] },
      emphasis: { itemStyle: { color: "#8ddaf7" } },
    },
  ],
  grid: { top: 10, bottom: 6, left: 8, right: 12, containLabel: true },
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
