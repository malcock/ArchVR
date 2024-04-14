<script setup lang="ts">
import { computed, inject, ref } from "vue";
import IfcGroup from "./ifc/IfcGroup.vue";
import IfcPropertySet from "./ifc/IfcPropertySet.vue";
import IfcMaterialLayerSetUsage from "./ifc/IfcMaterialLayerSetUsage.vue";
import IfcGenericProperty from "./ifc/IfcGenericProperty.vue";
import type { EditorSelection } from "~archvr3d";
import { useGraphStore } from "../../store/Graph.Store";
import { customAlphabet } from "nanoid";
import type { GraphType } from "~/server/trpc/routers/graph";

const nanoid = customAlphabet("1234567890abcdef", 16);

const editor = inject(EditorKey);
const bus = useEventBus(EditorBus);
const trpc = useTrpc();

const selection = ref<EditorSelection | null>(null);

const currentTab = ref(0);

editor?.onSelectionChange.add((sel) => {
  selection.value = sel;
  currentTab.value = 0;
});

const route = useRoute();

//for now, lets limit other tabs to working with a single selection
const sel = computed(() => selection.value?.objects[0]);

const multipleSelected = computed(
  () => selection.value && selection.value.objects.length > 1
);

const ifcMeta = computed(() => sel.value?.ifcMeta);
const isDevice = computed(() => sel.value?.type === "device");

const graphStore = useGraphStore();

async function openGraph() {
  // THIS CODE SUCKS
  //attempt to get the graph
  let graph: GraphType;
  if (sel.value) {
    try {
      graph = await trpc().graph.getByObjectTransform.query({
        objectId: "",
        transformId: sel.value.id,
      });
    } catch (err) {
      //failed - make a new one instead
      const f = {
        nodes: [
          {
            id: nanoid(),
            name: "Transform Output",
            data: {
              transformId: sel.value?.id,
            },
          },
        ],
        connections: [],
      };
      graph = await trpc().graph.createObjectTransformGraph.mutate({
        file: f,
        objectId: "",
        transformId: sel.value.id,
        sceneId: route.params.sceneId as string,
      });
    }

    bus.emit("graph.open", { graph });
  }
  // console.log(sel.value);
  // graphStore.currentGraph = {
  //   nodes: [
  //     {
  //       id: nanoid(),
  //       name: "Transform Output",
  //       data: {
  //         transformId: sel.value?.id,
  //       },
  //     },
  //   ],
  //   connections: [],
  // };
}
</script>

<template>
  <div class="editor-obj" v-if="!multipleSelected && sel">
    <EditorCoreField class="mx-2" label="ID" type="text" v-model="sel.id" />
    <div class="tabs">
      <a
        class="tab tab-bordered"
        :class="{ 'tab-active': currentTab === 0 }"
        @click="currentTab = 0"
        title="Object Properties"
      >
        <Icon>deployed_code</Icon></a
      >
      <a
        v-if="ifcMeta"
        class="tab tab-bordered"
        :class="{ 'tab-active': currentTab === 1 }"
        @click="currentTab = 1"
        title="IFC"
      >
        ifc</a
      >
      <a
        v-if="isDevice"
        class="tab tab-bordered"
        :class="{ 'tab-active': currentTab === 2 }"
        @click="currentTab = 2"
        title="Device"
      >
        <Icon>home_iot_device</Icon>
      </a>
    </div>
    <div class="tab-content" v-if="currentTab === 0">
      <IfcGroup title="Transform">
        <button class="btn btn-ghost" @click="openGraph">
          <Icon>account_tree</Icon>
        </button>
      </IfcGroup>
    </div>
    <div class="tab-content" v-if="currentTab === 1">
      <template v-if="ifcMeta" v-for="key in Object.keys(ifcMeta)" :key="key">
        <template v-if="Array.isArray(ifcMeta[key])">
          <IfcGroup v-if="key === 'IfcPropertySet'" title="IfcPropertySet">
            <IfcPropertySet
              v-for="propset in ifcMeta[key]"
              :propset="propset"
              class="join-item !bg-base-100"
            />
          </IfcGroup>
          <IfcGroup v-else-if="key === 'IfcMaterialLayerSetUsage'" :title="key">
            <IfcMaterialLayerSetUsage
              v-for="prop in ifcMeta[key]"
              :materialSet="prop"
            />
          </IfcGroup>
          <IfcGroup v-else :title="key">
            <IfcGenericProperty v-for="prop in ifcMeta[key]" :property="prop" />
          </IfcGroup>
        </template>
        <template v-else-if="typeof ifcMeta[key] === 'string'">
          <EditorCoreField :label="key" v-model="ifcMeta[key]" type="text" />
        </template>
      </template>
    </div>
    <div class="tab-content" v-if="currentTab === 2">
      <EditorDevicePanel :device="sel" />
    </div>
  </div>
</template>

<style>
.editor {
  &-obj {
    @apply flex-grow flex flex-col;

    .tab-content {
      @apply overflow-y-scroll h-80 grow bg-base-300 pt-2 px-1 block;
    }
  }
}
</style>
