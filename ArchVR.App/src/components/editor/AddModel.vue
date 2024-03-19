<script setup lang="ts">
import { type File as PrismaFile } from "@prisma/client";
import type { CoreDialog } from "#build/components";
import { EditorKey, EditorBus } from "@/composables/EditorKeys";
import type { SceneType } from "~/server/trpc/routers/scene";

let editor = inject(EditorKey);

const props = defineProps<{ scene: SceneType }>();

const trpc = useTrpc();

const modal = ref<InstanceType<typeof CoreDialog>>();
let bus = useEventBus(EditorBus);

bus.on((e) => {
  if (e === "model.new") {
    modal.value?.show();
  }
});

const selectedFile = ref<PrismaFile | null>(null);
const onSubmit = async () => {
  if (!selectedFile.value) return;
  const sceneFile = await trpc().scene.addFile.mutate({
    fileId: selectedFile.value.id,
    sceneId: props.scene.id,
    transform: `{"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"scaling":{"x":1,"y":1,"z":1}}`,
  });

  editor?.call("model.add", {
    name: sceneFile.name,
    filepath: sceneFile.file!.processed as string,
    transform: sceneFile.transform as string,
  });
};
</script>

<template>
  <CoreDialog ref="modal">
    <template #form>
      <form method="dialog" @submit="onSubmit">
        <FileBrowser @selected="(data) => (selectedFile = data)" />
        <div class="modal-action">
          <button class="btn btn-primary">Add Object</button>
        </div>
      </form>
    </template>
  </CoreDialog>
</template>

<style></style>
