<script setup lang="ts">
import { SelectField } from "./select-field";

defineProps<{
  data: SelectField;
}>();
</script>

<template>
  <select
    :value="data.value"
    @change="data.setValue($event.target.value)"
    class="gctl-select select select-xs"
    :class="{ 'is-unset': !data.value }"
    :id="data.id"
    @pointerdown.stop
  >
    <option value="" disabled>{{ data.placeholder }}</option>
    <option v-for="opt in data.options" :value="opt.value">
      {{ opt.text }}
    </option>
  </select>
</template>

<style>
.gctl-select {
  width: 100%;
  height: 26px;
  min-height: 26px;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  background-color: oklch(var(--b3));
  color: var(--ink-strong);
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 400;
  text-overflow: ellipsis;

  &.is-unset {
    color: var(--ink-dim);
    font-family: inherit;
  }
  &:hover {
    border-color: var(--hairline-strong);
  }
  &:focus-visible {
    outline: none;
    border-color: oklch(var(--p));
  }
}
</style>
