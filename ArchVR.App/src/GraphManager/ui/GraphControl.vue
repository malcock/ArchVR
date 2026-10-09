<script lang="ts">
import { defineComponent } from "vue";

const round = (n: number, places: number) => n.toFixed(places);

// Rete controls aren't reactive: the area re-renders this on update,
// so the readout is a method, not a cached computed.
export default defineComponent({
  props: ["data"],
  methods: {
    change(e: Event) {
      const value = (e.target as HTMLInputElement).value;
      this.data.setValue(this.data.type === "number" ? +value : value);
    },
    readout(): string {
      const raw = this.data.value;
      if (raw === undefined || raw === null || raw === "") return "";
      try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (typeof parsed === "number") return round(parsed, 3);
        // a Vector serialises as { values: [...] }
        if (Array.isArray(parsed?.values)) {
          return parsed.values.map((v: number) => round(v, 2)).join("  ");
        }
      } catch {}
      return String(raw);
    },
  },
});
</script>

<template>
  <output v-if="data.readonly" class="gctl-readout" :hidden="!readout()">
    {{ readout() }}
  </output>
  <input
    v-else
    class="gctl-input"
    :type="data.type"
    :value="data.value"
    @input="change"
    @pointerdown.stop
    @dblclick.stop
  />
</template>

<style>
.gctl-input,
.gctl-readout {
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: 26px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid var(--hairline);
  background: oklch(var(--b3));
  color: var(--ink-strong);
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 12px;
  line-height: 24px;
  font-variant-numeric: tabular-nums;
}
.gctl-input {
  text-align: right;
  transition: border-color 0.15s;

  &:hover {
    border-color: var(--hairline-strong);
  }
  &:focus-visible {
    outline: none;
    border-color: oklch(var(--p));
  }
}
.gctl-readout {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
