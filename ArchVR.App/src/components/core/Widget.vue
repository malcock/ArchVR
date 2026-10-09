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
  <div class="widget panel" ref="el" :style="fullStyle" style="position: fixed">
    <div class="widget-handle" ref="handle">
      <div class="widget-title" :title="widget.name">{{ widget.name }}</div>
      <button
        type="button"
        class="widget-action"
        title="Edit node graph"
        aria-label="Edit node graph"
        @click="openGraph"
        @pointerdown.stop
      >
        <Icon aria-hidden="true">account_tree</Icon>
      </button>
    </div>
    <div class="widget-body">
      <slot />
    </div>
  </div>
</template>

<style>
.widget {
  @apply absolute flex flex-col overflow-hidden;
  border-radius: 10px;

  &-handle {
    @apply flex items-center justify-between gap-2 cursor-move select-none;
    height: 28px;
    flex: none;
    padding: 0 4px 0 10px;
    border-bottom: 1px solid var(--hairline);
  }
  &-title {
    @apply truncate font-medium;
    color: var(--ink-strong);
    font-size: 11.5px;
  }
  &-action {
    @apply grid place-items-center rounded transition-colors;
    width: 22px;
    height: 22px;
    flex: none;
    color: var(--ink-dim);

    .icon {
      font-size: 15px;
    }
    &:hover {
      background: rgb(255 255 255 / 0.08);
      color: var(--ink-strong);
    }
  }
  /* the body owns the remaining height, so content can't spill past the frame */
  &-body {
    @apply relative flex-1 min-h-0 min-w-0;
  }
}
</style>
