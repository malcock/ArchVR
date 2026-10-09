<script setup lang="ts">
import type { ClassicPreset } from "rete";
import { signalKind } from "./meta";

defineProps<{ data: ClassicPreset.Socket }>();
</script>

<template>
  <div class="gsocket" :data-kind="signalKind(data.name)" :title="data.name" />
</template>

<style>
.gsocket {
  --sig: var(--signal-number);
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--sig);
  border: 2px solid oklch(var(--b1));
  box-sizing: border-box;
  cursor: crosshair;
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);

  &[data-kind="vector"] {
    --sig: var(--signal-vector);
  }
  &[data-kind="text"] {
    --sig: var(--signal-text);
  }
  &[data-kind="image"] {
    --sig: var(--signal-image);
  }
  &:hover {
    transform: scale(1.35);
  }
}
</style>
