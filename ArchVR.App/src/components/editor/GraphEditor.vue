<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import { GraphEditorApp, type DeviceId } from "../../rete";
import { useRoute } from "vue-router";
import { useIntervalFn } from "@vueuse/core";
import { useGraphStore } from "~/store/Graph.Store";
import type { DeviceType } from "~/server/trpc/routers/devices";

const editor = inject(EditorKey);
const bus = useEventBus(EditorBus);

const trpc = useTrpc();

const props = defineProps<{
  graphId?: string;
  graph?: object;
  outputType?: "alert" | "transform" | "material" | "texture";
}>();

// let editor = null;
const rete = ref<HTMLElement | null>(null);

const graphStore = useGraphStore();

const route = useRoute();

const deviceList = ref<DeviceType[]>([]);

const sceneId = computed(() => route.params.sceneId as string);

watch(
  () => graphStore.currentGraph,
  (newVal) => {
    graphStore.editorOpen = true;
    console.log(newVal);
    if (graphEditor && newVal) {
      graphEditor.loadGraph(newVal);
    }
  }
);

// simulate data
const {} = useIntervalFn(async () => {
  if (graphEditor) {
    // const devices = await getDevices();
    deviceList.value.forEach((d) => {
      graphEditor!.updateDevice({
        deviceId: d.id,
        data: { x: Math.random(), y: Math.random(), z: Math.random() },
      });
    });
  }
}, 500);

const isOpen = computed(() => graphStore.editorOpen);

async function saveGraph() {
  graphStore.editorOpen = false;
  if (graphStore.currentGraph && graphEditor) {
    const graph = await graphEditor.saveGraph();
    const newGraph = await trpc().graph.update.mutate({
      graphId: graphStore.currentGraph.id as string,
      file: graph,
    });
  }
}

async function getDevices() {
  // return deviceStore.sceneDevices[]
  return (await trpc().device.list.query({ take: 10000 })).items;
}
const updateWidget = (widgetId: string, data: any) =>
  bus.emit("widget.update", { widgetId, data });
let graphEditor: GraphEditorApp | null = new GraphEditorApp();
onMounted(async () => {
  //TODO: Make less shitty?
  deviceList.value = await getDevices();
  if (rete.value && graphEditor) {
    graphEditor.createEditor(
      rete.value,
      deviceList.value,
      editor!.updateTransform,
      updateWidget
    );
  }
});
</script>

<template>
  <dialog id="rete-editor" class="modal" :open="isOpen">
    <div class="modal-box w-10/12 max-w-6xl bg-base-200">
      <div class="rete" ref="rete"></div>
      <div class="modal-action">
        <form method="dialog" @submit="saveGraph">
          <button
            type="button"
            class="btn btn-ghost"
            @click="graphStore.editorOpen = false"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style>
.rete {
  width: 100%;
  height: 80vh;
}
</style>
