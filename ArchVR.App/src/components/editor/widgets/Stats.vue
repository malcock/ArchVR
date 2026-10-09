<script setup lang="ts">
import type { SceneWidgetType } from "~/server/trpc/routers/scene";
import { formatValue } from "~/config/chartTheme";

const props = defineProps<{ widget: SceneWidgetType }>();
const initialGraph = useWidgetOutputGraph(props.widget);

const WINDOW = 120;
const samples = ref<number[]>([]);
const unit = ref("");

const gotData = (d: { data: unknown; unit?: string }) => {
  if (typeof d.unit === "string") unit.value = d.unit;
  if (typeof d.data !== "number") return;
  samples.value.push(d.data);
  if (samples.value.length > WINDOW) samples.value.shift();
};

const stats = computed(() => {
  const s = samples.value;
  if (!s.length) return null;
  const min = Math.min(...s);
  const max = Math.max(...s);
  return {
    last: s[s.length - 1],
    min,
    max,
    mean: s.reduce((a, b) => a + b, 0) / s.length,
  };
});

// sparkline in a 100 x 24 box, stretched to the widget's width
const sparkline = computed(() => {
  const s = samples.value;
  if (s.length < 2 || !stats.value) return "";
  const { min, max } = stats.value;
  const span = max - min || 1;
  return s
    .map((v, i) => {
      const x = (i / (s.length - 1)) * 100;
      const y = 22 - ((v - min) / span) * 20;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
});
</script>

<template>
  <CoreWidget
    :widget="widget"
    :initial-graph="initialGraph"
    @data-received="gotData"
  >
    <div v-if="stats" class="widget-stats">
      <p class="widget-stats-value">
        {{ formatValue(stats.last) }}
        <span v-if="unit" class="widget-unit">{{ unit }}</span>
      </p>
      <svg
        class="widget-stats-spark"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline :points="sparkline" />
      </svg>
      <dl class="widget-stats-range">
        <div>
          <dt>Min</dt>
          <dd>{{ formatValue(stats.min) }}</dd>
        </div>
        <div>
          <dt>Mean</dt>
          <dd>{{ formatValue(stats.mean) }}</dd>
        </div>
        <div>
          <dt>Max</dt>
          <dd>{{ formatValue(stats.max) }}</dd>
        </div>
      </dl>
    </div>
    <p v-else class="widget-blank">No data yet</p>
  </CoreWidget>
</template>

<style>
.widget-stats {
  @apply absolute inset-0 flex flex-col px-3 pt-2 pb-2;

  &-value {
    @apply flex items-baseline gap-1.5 font-semibold whitespace-nowrap;
    color: var(--ink-strong);
    font-size: 1.625rem;
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  &-spark {
    @apply w-full flex-1 min-h-0 my-1.5;

    polyline {
      fill: none;
      stroke: var(--signal-number);
      stroke-width: 1.5;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
  }
  &-range {
    @apply grid grid-cols-3 gap-2;
    font-variant-numeric: tabular-nums;

    dt {
      color: var(--ink-dim);
      font-size: 0.625rem;
    }
    dd {
      color: oklch(var(--bc));
      font-size: 0.75rem;
    }
  }
}
</style>
