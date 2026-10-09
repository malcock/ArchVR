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
  <aside v-if="ready" id="editortools" class="editor-tools panel">
    <button
      v-for="tool in tools"
      :title="tool.name"
      type="button"
      class="editor-tool"
      :class="{ 'is-active': tool.name === currentTool!.name }"
      :aria-label="tool.name"
      :aria-pressed="tool.name === currentTool!.name"
      @click="selectTool(tool.name)"
    >
      <Icon>{{ tool.icon }}</Icon>
    </button>
  </aside>
</template>

<style>
.editor {
  &-tools {
    @apply absolute flex flex-col gap-1 p-1 top-16 left-3 rounded-box;
  }
  &-tool {
    @apply grid place-items-center w-9 h-9 rounded-lg transition-colors;
    color: var(--ink-dim);

    .icon {
      font-size: 20px;
    }
    &:hover {
      background: rgb(255 255 255 / 0.07);
      color: var(--ink-strong);
    }
    &.is-active {
      background: oklch(var(--p) / 0.14);
      color: oklch(var(--p));
    }
  }
}
</style>
~/composables/EditorKeys
