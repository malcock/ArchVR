<script setup lang="ts">
import { EditorApp } from "~archvr3d";
const route = useRoute();

const trpc = useTrpc();

const { sceneId, projectId } = route.params;
const scene = ref<any>(null);
const getScene = async () => {
  scene.value = await trpc().scene.get.query({
    id: sceneId as string,
    projectId: projectId as string,
  });
};
onMounted(() => {
  getScene();
});
let editor: EditorApp | null = new EditorApp();
provide(EditorKey, editor);
</script>

<template>
  <div id="editorwnd">
    <!-- <div>{{ scene.name }}</div> -->
    <EditorRoot :scene="scene" />
    <!-- <EditorRoot :scene="scene" /> -->
    <!-- <GraphEditor /> -->
  </div>
</template>

<style>
#editorwnd {
  @apply flex flex-grow flex-col;
}
</style>
