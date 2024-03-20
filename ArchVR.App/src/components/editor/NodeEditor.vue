<script setup lang="ts">
import { GraphManager } from "~/GraphManager";
import type { DeviceType } from "~/server/trpc/routers/devices";
import type { SceneType } from "~/server/trpc/routers/scene";
import { useDeviceFaker } from "./deviceFaker";

const props = defineProps<{
  scene: SceneType;
}>();
const editor = inject(EditorKey);
const bus = useEventBus(EditorBus);
const trpc = useTrpc();

const rete = ref<HTMLElement | null>(null);

const isOpen = ref(false);

const deviceList = ref<DeviceType[]>([]);

async function getDevices(term: string): Promise<DeviceType[]> {
  // return deviceStore.sceneDevices[]
  // return (await trpc().device.list.query({ take: 10000 })).items;
  return new Promise((resolve) => {
    resolve(deviceList.value);
  });
}
const updateWidget = (widgetId: string, data: any) =>
  bus.emit("widget.update", { widgetId, data });

let graphManager: GraphManager | null = null;

onMounted(async () => {
  deviceList.value = (await trpc().device.list.query({ take: 10000 })).items;
  graphManager = new GraphManager(
    deviceList.value,
    getDevices,
    editor!.updateTransform,
    updateWidget
  );
  for (var graph of props.scene.graphs) {
    await graphManager.loadGraph(graph);
  }
  if (rete.value && graphManager) {
    graphManager.createEditor(rete.value);
  }

  // fake some values
  const {} = useDeviceFaker(graphManager);
});
bus.on((e, p) => {
  if (e === "widget.open") {
    //we've received a command - yay
    const { graphId } = p;
    if (graphManager && graphId) {
      //get the right graph and load it
      const graph = props.scene.graphs.find((x) => x.id === graphId);
      if (graph) graphManager.setActiveGraph(graph);

      isOpen.value = true;
    }
  }
  if (e === "graph.open") {
    if (graphManager) {
      const { graph } = p;
      graphManager.setActiveGraph(graph);
      isOpen.value = true;
    }
  }
});

const saveGraph = async () => {
  if (graphManager) {
    const { file, graphId } = await graphManager.saveActiveGraph();
    if (File && graphId) {
      const newGraph = await trpc().graph.update.mutate({
        graphId,
        file,
      });
      //load the graph back into graphManager
      await graphManager.loadGraph(newGraph);
      //save it in our scene
      const index = props.scene.graphs.findIndex((x) => x.id === newGraph.id);
      if (index > -1) {
        props.scene.graphs.splice(index, 1);
        props.scene.graphs.push(newGraph);
      }

      isOpen.value = false;
    }
  }
};
</script>

<template>
  <dialog id="rete-editor" class="modal" :open="isOpen">
    <div class="modal-box w-10/12 max-w-6xl bg-base-200">
      <div class="rete" ref="rete"></div>
      <div class="modal-action">
        <form method="dialog" @submit="saveGraph">
          <button type="button" class="btn btn-ghost" @click="isOpen = false">
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
