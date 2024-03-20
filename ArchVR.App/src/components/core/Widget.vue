<script setup lang="ts">
import type { GraphIO } from "~/GraphManager/types";
import type { SceneWidgetType } from "~/server/trpc/routers/scene";
import { useGraphStore } from "~/store/Graph.Store";

const trpc = useTrpc();
const bus = useEventBus(EditorBus);

const graphStore = useGraphStore();

const props = defineProps<{
  widget: SceneWidgetType;
  initialGraph: () => GraphIO;
}>();
const emit = defineEmits(["onStart", "onEnd", "dataReceived"]);

const pos = reactive<{ x: number; y: number; w: number; h: number }>(
  JSON.parse(props.widget.position)
);
const el = ref<HTMLElement | null>(null);
const handle = ref<HTMLElement | null>(null);

const { x, y, style } = useDraggable(el, {
  handle,
  initialValue: {
    x: pos.x,
    y: pos.y,
  },
  axis: "both",
  onMove: () => emit("onStart"),
  onEnd: () => emit("onEnd"),
});

const fullStyle = computed(
  () => `width:${pos.w}px;height:${pos.h}px;left:${x.value}px;top:${y.value}px;`
);

const openGraph = async () => {
  if (!props.widget.graph) {
    console.log("no has graph");
    const newGraph = await trpc().graph.createSceneWidgetGraph.mutate({
      sceneId: props.widget.sceneId,
      file: props.initialGraph(),
      sceneWidgetId: props.widget.id,
    });
    props.widget.graph = { file: newGraph.file, id: newGraph.id };
  }
  const graph =
    typeof props.widget.graph.file === "string"
      ? (JSON.parse(props.widget.graph.file) as GraphIO)
      : (props.widget.graph.file as GraphIO);
  graphStore.currentGraph = {
    ...graph,
    id: props.widget.graph.id,
  };

  bus.emit("widget.open", { graphId: props.widget.graph.id });
};

watch(
  () => graphStore.editorOpen,
  (newVal) => {
    if (!newVal && graphStore.currentGraph) {
    }
  }
);

bus.on((e, payload) => {
  if (e === "widget.update") {
    if (payload.widgetId === props.widget.id) {
      emit("dataReceived", payload.data);
    }
  }
});
</script>

<template>
  <div class="widget" ref="el" :style="fullStyle" style="position: fixed">
    <div class="widget-handle" ref="handle">
      <div class="widget-title">{{ widget.name }}</div>
      <button @click="openGraph">[*]</button>
    </div>
    <div class="widget-body h-full">
      <slot />
    </div>
  </div>
</template>

<style>
.widget {
  @apply bg-base-100 absolute rounded;

  &-handle {
    @apply cursor-move px-2 py-1 flex justify-between;
  }
  &-body {
    @apply p-2;
  }
}
</style>
