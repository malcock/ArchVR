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
bus.on(async (e, p) => {
  if (e === "widget.open") {
    //we've received a command - yay
    const { graphId } = p;
    if (graphManager && graphId) {
      //get the right graph and load it
      let graph = props.scene.graphs.find((x) => x.id === graphId);
      //failed to get from scene, attempt to get from API - needs improvment!!
      if (!graph) graph = await trpc().graph.get.query({ graphId });
      if (graph) await graphManager.setActiveGraph(graph);

      isOpen.value = true;
      graphManager.fitView();
    }
  }
  if (e === "graph.open") {
    if (graphManager) {
      const { graph } = p;
      await graphManager.setActiveGraph(graph);
      isOpen.value = true;
      graphManager.fitView();
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
  <dialog id="rete-editor" class="modal graph-modal" :open="isOpen">
    <div class="graph-shell">
      <header class="graph-bar">
        <h2 class="graph-title">
          <Icon aria-hidden="true">account_tree</Icon>
          Node graph
        </h2>
        <p class="graph-hint">
          Right-click the canvas to add a node. Drag from one port to another
          to connect them.
        </p>
        <div class="graph-actions">
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square"
            title="Tidy layout"
            aria-label="Tidy layout"
            @click="graphManager?.tidy()"
          >
            <Icon aria-hidden="true">auto_fix_high</Icon>
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square"
            title="Fit to view"
            aria-label="Fit to view"
            @click="graphManager?.fitView()"
          >
            <Icon aria-hidden="true">fit_screen</Icon>
          </button>
          <span class="graph-divider" aria-hidden="true"></span>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            @click="isOpen = false"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-primary btn-sm" @click="saveGraph">
            Save
          </button>
        </div>
      </header>
      <div class="graph-canvas">
        <div class="rete" ref="rete"></div>
        <ul class="graph-legend" aria-label="Port types">
          <li><i style="background: var(--signal-number)"></i>Number</li>
          <li><i style="background: var(--signal-vector)"></i>Vector</li>
          <li><i style="background: var(--signal-text)"></i>Text</li>
        </ul>
      </div>
    </div>
  </dialog>
</template>

<style>
.graph-modal {
  padding: 1rem;
}
.graph-shell {
  display: flex;
  flex-direction: column;
  width: min(100%, 90rem);
  height: 100%;
  max-height: calc(100dvh - 2rem);
  overflow: hidden;
  border-radius: var(--rounded-box);
  border: 1px solid var(--hairline-strong);
  background: oklch(var(--b1));
  box-shadow: 0 32px 64px -24px rgb(0 0 0 / 0.8), 0 4px 12px rgb(0 0 0 / 0.4);
}

.graph-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 3rem;
  padding: 0 0.5rem 0 1rem;
  border-bottom: 1px solid var(--hairline);
}
.graph-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;

  .icon {
    font-size: 18px;
    color: var(--ink-dim);
  }
}
.graph-hint {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ink-dim);
  font-size: 0.75rem;
}
.graph-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;

  .icon {
    font-size: 18px;
  }
}
.graph-divider {
  width: 1px;
  height: 1.25rem;
  margin: 0 0.375rem;
  background: var(--hairline-strong);
}

.graph-canvas {
  position: relative;
  flex: 1;
  min-height: 0;
  background: oklch(var(--b3));
}
.rete {
  width: 100%;
  height: 100%;
  cursor: default;
}
.rete-grid {
  position: absolute;
  top: -50000px;
  left: -50000px;
  width: 100000px;
  height: 100000px;
  z-index: -1;
  background-image: radial-gradient(
    circle,
    rgb(255 255 255 / 0.11) 1px,
    transparent 1.5px
  );
  background-size: 24px 24px;
}

.graph-legend {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  display: flex;
  gap: 0.875rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid var(--hairline);
  background: oklch(var(--b1));
  color: var(--ink-dim);
  font-size: 0.6875rem;
  pointer-events: none;

  li {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  i {
    width: 8px;
    height: 8px;
    border-radius: 999px;
  }
}

/* Rete's add-node menu ships its own look; bring it into the theme */
#rete-editor [rete-context-menu] {
  width: 176px;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--hairline-strong);
  background: oklch(var(--b1));
  box-shadow: var(--shadow-panel);
  font-family: inherit;
  font-size: 12.5px;

  .block {
    display: block;
    padding: 0;
    border: 0;
    height: auto;
    min-height: 0;
    border-radius: 6px;
    background: transparent;
    color: oklch(var(--bc));
    line-height: 1.3;
  }
  .content {
    padding: 0;
  }
  [data-testid="context-menu-item"] {
    position: relative;
    padding: 6px 10px;
    cursor: pointer;

    &:hover {
      background: rgb(255 255 255 / 0.07);
      color: var(--ink-strong);
    }
    &.hasSubitems::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 10px;
      width: 6px;
      height: 6px;
      border: solid var(--ink-dim);
      border-width: 1.5px 1.5px 0 0;
      opacity: 1;
      transform: translateY(-50%) rotate(45deg);
    }
  }
  .subitems {
    top: -5px;
    left: calc(100% + 4px);
    width: 176px;
    padding: 4px;
    border-radius: 10px;
    border: 1px solid var(--hairline-strong);
    background: oklch(var(--b1));
    box-shadow: var(--shadow-panel);
  }
  .search {
    width: 100%;
    height: 28px;
    margin-bottom: 4px;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid var(--hairline);
    background: oklch(var(--b3));
    color: var(--ink-strong);
    font-family: inherit;
    font-size: 12.5px;

    &:focus-visible {
      outline: none;
      border-color: oklch(var(--p));
    }
  }
}
</style>
