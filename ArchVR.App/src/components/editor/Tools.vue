<script setup lang="ts">
import { EditorKey } from "@/composables/EditorKeys";

let editor = inject(EditorKey);
const ready = ref(false);
editor?.onEditorReady.addOnce((val) => {
  ready.value = val;
});

const selectTool = (name: string) => {
  editor?.setCurrentToolByName(name);
};
const tools = computed(() => editor?.tools);
const currentTool = ref(editor?.currentTool);

editor?.onToolSelected.add((tool) => {
  console.log({ tool });
  currentTool.value = tool;
});
</script>

<template>
  <aside v-if="ready" id="editortools" class="editor-tools">
    <button
      v-for="tool in tools"
      :title="tool.name"
      class="btn btn-square"
      :class="{ 'text-primary': tool.name === currentTool!.name }"
      @click="selectTool(tool.name)"
    >
      <Icon>{{ tool.icon }}</Icon>
    </button>
  </aside>
</template>

<style>
.editor {
  &-tools {
    @apply absolute flex flex-col bg-base-100 top-20 left-4  rounded-box;
  }
}
</style>
~/composables/EditorKeys
