<script setup lang="ts">
import EditorKey from "../../composables/EditorKey";
const editor = inject(EditorKey);
const props = defineProps<{
  scene: any;
}>();

const bjsCanvas = ref<HTMLCanvasElement | null>(null);
console.log("WHAG");
onMounted(() => {
  console.log("mounted");
  console.log({ editor });
  if (bjsCanvas.value && editor) {
    editor.createEditor(bjsCanvas.value);
    // editor.loadScene(props.scene);
    console.log("available");
    // useEditorObservables(editor, props.scene.id);
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
  <div class="editor">
    <canvas
      class="editor-main"
      ref="bjsCanvas"
      width="300"
      height="200"
    ></canvas>
    <!-- <EditorTools /> -->
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
  @apply absolute flex flex-col bg-base-100 top-20 w-64 bottom-20 right-4 rounded-box overflow-hidden;
}
</style>
