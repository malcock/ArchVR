<script setup lang="ts">
import { connectionKind } from "./meta";

defineProps<{
  data: { source?: string; sourceOutput?: string };
  start: unknown;
  end: unknown;
  path: string;
}>();
</script>

<template>
  <svg class="gconn" data-testid="connection" :data-kind="connectionKind(data)">
    <path class="gconn-hit" :d="path" />
    <path class="gconn-line" :d="path" />
  </svg>
</template>

<style>
.gconn {
  --sig: var(--signal-number);
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
  width: 9999px;
  height: 9999px;

  &[data-kind="vector"] {
    --sig: var(--signal-vector);
  }
  &[data-kind="text"] {
    --sig: var(--signal-text);
  }
  &[data-kind="image"] {
    --sig: var(--signal-image);
  }

  path {
    fill: none;
    stroke-linecap: round;
  }
  .gconn-hit {
    stroke: transparent;
    stroke-width: 14px;
    pointer-events: auto;
  }
  .gconn-line {
    stroke: var(--sig);
    stroke-width: 2px;
    opacity: 0.85;
    transition: opacity 0.15s, stroke-width 0.15s;
  }
  .gconn-hit:hover + .gconn-line {
    opacity: 1;
    stroke-width: 3px;
  }
}
</style>
