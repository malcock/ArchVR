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
  console.log(e);
  if (e === "model.new") {
    console.log("new ob!");
    modal.value?.show();
  }
});

const selectedFile = ref<PrismaFile | null>(null);
const onSubmit = () => {
  if (!selectedFile.value) return;
  trpc().scene.addFile.mutate({
    fileId: selectedFile.value.id,
    sceneId: props.scene.id,
  });
  editor?.call("model.add", {
    name: selectedFile.value.name,
    filepath: selectedFile.value.processed as string,
    transform: `{
    "position": {
        "x": 0,
        "y": 0,
        "z": 0
    },
    "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
    },
    "scaling": {
        "x": 1,
        "y": 1,
        "z": 1
    }
}`,
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
