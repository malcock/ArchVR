<script setup lang="ts">
import { type WidgetType, type SceneWidgets } from "@prisma/client";
import type { CoreDialog } from "#build/components";
import { EditorKey, EditorBus } from "@/composables/EditorKeys";
import type { SceneType } from "~/server/trpc/routers/scene";

import {
  EditorWidgetsKpi,
  EditorWidgetsLine,
  EditorWidgetsBlank,
} from "#components";

let editor = inject(EditorKey);

const props = defineProps<{ modelValue: SceneType }>();
const emit = defineEmits<{ "update:modelValue": [data: SceneType] }>();
// const scene = defineModel({type:typeof SceneType});

let bus = useEventBus(EditorBus);

bus.on((e) => {
  if (e === "widget.new") {
    console.log("new ob!");
  }
});

const gridSize = ref(32);

const getComponent = (
  kind: { name: string; component: string } | null = null
) => {
  const componentMap = {
    line: EditorWidgetsLine,
    kpi: EditorWidgetsKpi,
  };
  if (!kind) {
    return EditorWidgetsBlank;
  }
  // may need an "unknown widget type" in future?
  return kind.component in componentMap
    ? componentMap[kind.component as keyof typeof componentMap]
    : EditorWidgetsBlank;
};

const gridStyle = computed(() =>
  showGrid.value
    ? `background-size:${gridSize.value}px ${gridSize.value}px;`
    : `background:none;`
);
const showGrid = ref(false);
</script>

<template>
  <div class="widget-backdrop" :style="gridStyle"></div>
  <component
    v-for="widget in modelValue.widgets"
    :is="getComponent(widget.widgetType)"
    :widget="widget"
    @onStart="showGrid = true"
    @onEnd="showGrid = false"
  />
</template>

<style>
.widget-backdrop {
  background-size: 40px 40px;
  background-position: 0 0;
  background-image: radial-gradient(circle, #fff 0px, rgba(0, 0, 0, 0) 2px);
  width: 100vw;
  height: 100vh;
  position: fixed;
  pointer-events: none;
}
</style>
