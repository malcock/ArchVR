<script setup lang="ts">
import { GraphManager } from "~/GraphManager";
import type { DeviceType } from "~/server/trpc/routers/devices";
import type { SceneType } from "~/server/trpc/routers/scene";

const props = defineProps<{
  scene: SceneType;
}>();
const editor = inject(EditorKey);
const bus = useEventBus(EditorBus);
const trpc = useTrpc();

const rete = ref<HTMLElement | null>(null);

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
  if (rete.value && graphManager) {
    graphManager.createEditor(rete.value);
  }
});
bus.on((e, p) => {
  if (e === "widget.open") {
    //we've received a command - yay
    const { graphId } = p;
    if (graphManager && graphId) {
      //get the right graph and load it
      const graph = props.scene.graphs.find((x) => x.id === graphId);
      if (graph) graphManager.setActiveGraph(graph);
    }
  }
});
</script>

<template>
  <dialog id="rete-editor" class="modal" :open="isOpen">
    <div class="modal-box w-10/12 max-w-6xl bg-base-200">
      <div class="rete" ref="rete"></div>
      <div class="modal-action">
        <form method="dialog" @submit="saveGraph">
          <button type="button" class="btn btn-ghost" @click="">Cancel</button>
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
