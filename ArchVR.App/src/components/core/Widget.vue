<script setup lang="ts">
const props = defineProps<{ position: string; name: string }>();
const emit = defineEmits(["onStart", "onEnd"]);

const pos = reactive<{ x: number; y: number; w: number; h: number }>(
  JSON.parse(props.position)
);
const el = ref<HTMLElement | null>(null);
const handle = ref<HTMLElement | null>(null);

const { x, y, style } = useDraggable(el, {
  handle,
  initialValue: {
    x: pos.x,
    y: pos.y,
  },
  axis: "both",
  onStart: () => emit("onStart"),
  onEnd: () => emit("onEnd"),
});

const fullStyle = computed(
  () => `width:${pos.w}px;height:${pos.h}px;left:${x.value}px;top:${y.value}px;`
);
</script>

<template>
  <div class="widget" ref="el" :style="fullStyle" style="position: fixed">
    <div class="widget-handle" ref="handle">
      <div class="widget-title">{{ name }}</div>
    </div>
    <div class="widget-body">
      <slot />
    </div>
  </div>
</template>

<style>
.widget {
  @apply bg-base-100 absolute rounded;

  &-handle {
    @apply cursor-move px-2 py-1;
  }
  &-body {
    @apply p-2;
  }
}
</style>
