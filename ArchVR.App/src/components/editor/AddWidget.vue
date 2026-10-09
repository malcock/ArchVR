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

// what each type shows, and the size it needs to show it
const widgetInfo: Record<string, { about: string; w: number; h: number }> = {
  kpi: { about: "The latest value, large.", w: 256, h: 128 },
  line: { about: "One value over time.", w: 256, h: 128 },
  stats: {
    about: "Latest value with its recent trend, minimum, mean and maximum.",
    w: 256,
    h: 160,
  },
  multiline: {
    about: "A vector over time, one line per component.",
    w: 352,
    h: 192,
  },
  histogram: {
    about: "How recent values are distributed across their range.",
    w: 304,
    h: 176,
  },
};

const selectedWidget = ref<WidgetType | null>(null);
const onSubmit = async () => {
  if (!selectedWidget.value) return;
  const { w, h } = widgetInfo[selectedWidget.value.component] ?? {
    w: 256,
    h: 128,
  };
  // step each new widget down and right so it doesn't land on the last one
  const offset = (props.scene.widgets.length % 8) * 32;
  const sceneWidget = await trpc().scene.addWidget.query({
    sceneId: props.scene.id,
    widgetTypeId: selectedWidget.value.id,
    name: selectedWidget.value.name,
    position: { x: 92 + offset, y: 92 + offset, w, h },
  });
  emit("added", sceneWidget);
};
</script>

<template>
  <CoreDialog ref="modal">
    <template #form>
      <form method="dialog" @submit="onSubmit">
        <h2 class="text-base font-semibold mb-3">Add a widget</h2>
        <label
          v-for="item in widgetTypes"
          class="widget-option"
          :class="{ 'is-selected': selectedWidget?.id === item.id }"
        >
          <input
            type="radio"
            name="widget-type"
            class="radio radio-primary radio-sm"
            v-model="selectedWidget"
            :value="item"
          />
          <span>
            <span class="widget-option-name">{{ item.name }}</span>
            <span class="widget-option-about">{{
              widgetInfo[item.component]?.about
            }}</span>
          </span>
        </label>
        <div class="modal-action">
          <button class="btn btn-primary" :disabled="!selectedWidget">
            Add widget
          </button>
        </div>
      </form>
    </template>
  </CoreDialog>
</template>

<style>
.widget-option {
  @apply flex items-start gap-3 px-3 py-2.5 mb-1.5 rounded-lg cursor-pointer transition-colors;
  border: 1px solid var(--hairline);

  &:hover {
    border-color: var(--hairline-strong);
  }
  &.is-selected {
    border-color: oklch(var(--p));
  }
  .radio {
    @apply mt-0.5;
  }
  &-name {
    @apply block text-sm font-medium;
    color: var(--ink-strong);
  }
  &-about {
    @apply block text-xs;
    color: var(--ink-dim);
  }
}
</style>
