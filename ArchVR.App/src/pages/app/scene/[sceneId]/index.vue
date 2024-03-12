<script setup lang="ts">
import { EditorKey } from "~/composables/EditorKeys";
import { EditorApp } from "~archvr3d";
const route = useRoute();

const trpc = useTrpc();

const { sceneId, projectId } = route.params;
const scene = ref<any>(null);
const getScene = async () => {
  scene.value = await trpc().scene.get.query({
    sceneId: sceneId as string,
  });
};
onMounted(() => {
  getScene();
});
let editor: EditorApp | null = new EditorApp();

provide(EditorKey, editor);
definePageMeta({
  layout: "editor",
});
</script>

<template>
  <div id="editorwnd">
    <!-- <div>{{ scene.name }}</div> -->
    <EditorRoot v-if="scene" :scene="scene" />
    <!-- <EditorRoot :scene="scene" /> -->
    <!-- <GraphEditor /> -->
  </div>
</template>

<style>
#editorwnd {
  @apply flex flex-grow flex-col;
}
</style>
