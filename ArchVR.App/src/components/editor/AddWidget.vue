<script setup lang="ts">
import { type WidgetType, type SceneWidgets } from "@prisma/client";
import type { CoreDialog } from "#build/components";
import { EditorKey, EditorBus } from "@/composables/EditorKeys";
import type { SceneType, SceneWidgetType } from "~/server/trpc/routers/scene";

const emit = defineEmits<{ added: [data: SceneWidgetType] }>();
let editor = inject(EditorKey);

const props = defineProps<{ scene: SceneType }>();

const trpc = useTrpc();

const modal = ref<InstanceType<typeof CoreDialog>>();
let bus = useEventBus(EditorBus);

bus.on((e) => {
  if (e === "widget.new") {
    modal.value?.show();
  }
});
const widgetTypes = ref<WidgetType[]>([]);

onMounted(async () => {
  widgetTypes.value = await trpc().config.widgetTypes.query();
});

const selectedWidget = ref<SceneWidgetType | null>(null);
const onSubmit = async () => {
  if (!selectedWidget.value) return;
  const sceneWidget = await trpc().scene.addWidget.query({
    sceneId: props.scene.id,
    widgetTypeId: selectedWidget.value.id,
  });
  emit("added", sceneWidget);
};
</script>

<template>
  <CoreDialog ref="modal">
    <template #form>
      <form method="dialog" @submit="onSubmit">
        <div class="form-control" v-for="item in widgetTypes">
          <label class="label cursor-pointer">
            <span class="label-text">{{ item.name }}</span>
            <input
              type="radio"
              name="radio-10"
              class="radio radio-primary radio-sm"
              v-model="selectedWidget"
              :value="item"
            />
          </label>
        </div>
        <div class="modal-action">
          <button class="btn btn-primary">Add Widget</button>
        </div>
      </form>
    </template>
  </CoreDialog>
</template>

<style></style>
