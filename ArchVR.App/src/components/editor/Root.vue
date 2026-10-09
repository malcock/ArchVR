<script setup lang="ts">
import { EditorKey, EditorBus } from "@/composables/EditorKeys";
import type { SceneType, SceneWidgetType } from "~/server/trpc/routers/scene";
let editor = inject(EditorKey);

let bus = useEventBus(EditorBus);

bus.on((e, payload) => {
  // console.log("root", e);
});

const props = defineProps<{
  scene: SceneType;
}>();

const sceneCopy = ref(JSON.parse(JSON.stringify(props.scene)));
// const scene = defineModel<SceneType>({ required: true });

const bjsCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(async () => {
  console.log({ editor });
  if (bjsCanvas.value && editor) {
    editor.createEditor(bjsCanvas.value);

    //go go scene loading procedure!
    // load models
    console.log("loading models");
    // const modelLoaders = await Promise.all(sceneCopy.value.files.map(x=>editor!.call("model.add",{name:x.name,filepath:x.file!.processed as string, transform:x.transform as string})))
    for (let i = 0; i < sceneCopy.value.files.length; i++) {
      let file = sceneCopy.value.files[i];
      console.log("loading file", file);
      await editor.call("model.add", {
        name: file.name,
        filepath: file.file!.processed as string,
        transform: file.transform as string,
      });
      console.log("loaded file", file);
    }
    console.log("loaded models");
    //load devices
    for (var device of sceneCopy.value.devices) {
      editor.call("device.create", {
        id: device.id,
        transform: device.transform as string,
      });
    }
    console.log("loaded devices");
    // editor.loadScene(sceneCopy.value);

    UseEditorObservables(editor, sceneCopy.value.id);
  }
});

onUnmounted(() => {
  console.log("editor was unmounted");
  if (editor) editor.dispose();
  //@ts-ignore
  editor = null;
});

const widgetAdded = (widget: SceneWidgetType) => {
  sceneCopy.value.widgets.push(widget);
};
</script>

<template>
  <EditorHeader />
  <div class="editor">
    <canvas
      class="editor-main"
      ref="bjsCanvas"
      width="300"
      height="200"
    ></canvas>
    <EditorWidgets v-model="sceneCopy" />
    <EditorTools />
    <EditorAddModel :scene="sceneCopy" />
    <EditorAddWidget :scene="sceneCopy" @added="widgetAdded" />
    <aside id="editorsidebar" class="editor-side panel">
      <!-- <EditorExplorer /> -->
      <EditorPropertyPanel />
    </aside>
    <EditorNodeEditor :scene="sceneCopy" />
  </div>
</template>

<style>
.editor {
  @apply flex w-full h-full text-xs;
}
.editor-main {
  &:focus-visible {
    outline: none;
  }
}

.editor-side {
  @apply absolute flex flex-col top-16 w-72 bottom-3 right-3 rounded-box overflow-hidden;
}
</style>
