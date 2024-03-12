<script setup lang="ts">
import { EditorKey, EditorBus } from "@/composables/EditorKeys";
import type { SceneType } from "~/server/trpc/routers/scene";
import type { EditorApp } from "~archvr3d/dist/archvr-3d";
let editor = inject(EditorKey);

let bus = useEventBus(EditorBus);

bus.on((e, payload) => {
  console.log("root", e);
});

const props = defineProps<{
  scene: SceneType;
}>();

const bjsCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  console.log({ editor });
  if (bjsCanvas.value && editor) {
    editor.createEditor(bjsCanvas.value);
    // editor.loadScene(props.scene);

    UseEditorObservables(editor, props.scene.id);
  }
});

onUnmounted(() => {
  console.log("editor was unmounted");
  if (editor) editor.dispose();
  //@ts-ignore
  editor = null;
});
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
    <EditorTools />
    <EditorAddModel :scene="scene" />
    <aside id="editorsidebar" class="editor-side">
      <!-- <EditorExplorer />
      <EditorPropertyPanel /> -->
    </aside>
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
  @apply absolute flex flex-col bg-base-100 top-20 w-64 bottom-20 right-2 rounded-box overflow-hidden;
}
</style>
../../composables/EditorKeys
