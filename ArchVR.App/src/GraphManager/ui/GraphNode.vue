<script lang="ts">
import { defineComponent } from "vue";
import { Ref } from "rete-vue-plugin";
import { nodeMeta } from "./meta";

function sortByIndex<T extends [string, any]>(entries: T[]) {
  return entries.sort((a, b) => (a[1]?.index || 0) - (b[1]?.index || 0));
}

// Device outputs carry their value in the label ("unit: °C")
function splitLabel(label = "") {
  const match = label.match(/^([A-Za-z]+):\s*(.*)$/);
  return match ? { key: match[1], value: match[2] } : { key: label };
}

export default defineComponent({
  props: ["data", "emit", "seed"],
  components: { Ref },
  methods: {
    meta() {
      return nodeMeta(this.data.label);
    },
    inputs() {
      return sortByIndex(Object.entries(this.data.inputs));
    },
    controls() {
      return sortByIndex(Object.entries(this.data.controls));
    },
    outputs() {
      return sortByIndex(Object.entries(this.data.outputs));
    },
    splitLabel,
  },
});
</script>

<template>
  <div
    class="gnode"
    :class="{ 'is-selected': data.selected, 'is-output': meta().isOutput }"
    :style="{ width: Number.isFinite(data.width) ? `${data.width}px` : '' }"
    data-testid="node"
  >
    <header class="gnode-head" data-testid="title">
      <span class="icon gnode-icon" aria-hidden="true">{{ meta().icon }}</span>
      <span class="gnode-title">{{ data.label }}</span>
    </header>

    <div class="gnode-body">
      <div
        v-for="[key, output] in outputs()"
        :key="'out-' + key + seed"
        class="gnode-row is-out"
        :data-testid="'output-' + key"
      >
        <span class="gnode-label" data-testid="output-title">
          <span class="gnode-key">{{ splitLabel(output.label).key }}</span>
          <span
            v-if="splitLabel(output.label).value !== undefined"
            class="gnode-value"
            >{{ splitLabel(output.label).value || "–" }}</span
          >
        </span>
        <Ref
          class="gnode-port is-out"
          :emit="emit"
          :data="{
            type: 'socket',
            side: 'output',
            key,
            nodeId: data.id,
            payload: output.socket,
          }"
          data-testid="output-socket"
        />
      </div>

      <Ref
        v-for="[key, control] in controls()"
        :key="'ctl-' + key + seed"
        class="gnode-control"
        :emit="emit"
        :data="{ type: 'control', payload: control }"
        :data-testid="'control-' + key"
      />

      <div
        v-for="[key, input] in inputs()"
        :key="'in-' + key + seed"
        class="gnode-row is-in"
        :data-testid="'input-' + key"
      >
        <Ref
          class="gnode-port is-in"
          :emit="emit"
          :data="{
            type: 'socket',
            side: 'input',
            key,
            nodeId: data.id,
            payload: input.socket,
          }"
          data-testid="input-socket"
        />
        <span class="gnode-label" data-testid="input-title">
          <span class="gnode-key">{{ input.label }}</span>
        </span>
        <Ref
          v-show="input.control && input.showControl"
          class="gnode-field"
          :emit="emit"
          :data="{ type: 'control', payload: input.control }"
          data-testid="input-control"
        />
      </div>
    </div>
  </div>
</template>

<style>
.gnode {
  position: relative;
  box-sizing: border-box;
  /* the area plugin writes each node's nominal height inline; size to content instead */
  height: auto !important;
  border-radius: 10px;
  border: 1px solid var(--hairline-strong);
  background: oklch(var(--b1));
  box-shadow: 0 10px 24px -10px rgb(0 0 0 / 0.75), 0 2px 4px rgb(0 0 0 / 0.3);
  color: oklch(var(--bc));
  font-size: 12px;
  line-height: 1.3;
  cursor: grab;
  user-select: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: rgb(255 255 255 / 0.24);
  }
  &:active {
    cursor: grabbing;
  }
  &.is-selected {
    border-color: oklch(var(--p));
    box-shadow: 0 0 0 1px oklch(var(--p)),
      0 14px 28px -10px rgb(0 0 0 / 0.8);
  }
}

.gnode-head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-bottom: 1px solid var(--hairline);
  border-radius: 9px 9px 0 0;
  background: rgb(255 255 255 / 0.03);
}
.gnode-icon {
  font-size: 16px;
  color: var(--ink-dim);

  .is-output & {
    color: oklch(var(--p));
  }
}
.gnode-title {
  color: var(--ink-strong);
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gnode-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0 10px;
}

.gnode-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  padding: 0 14px;

  &.is-out {
    justify-content: flex-end;
    text-align: right;
  }
}

/* 24px hit box; the 12px dot sits on the node edge and the wire meets its rim */
.gnode-port {
  position: absolute;
  top: 50%;
  display: flex;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-top: -12px;

  &.is-in {
    left: -7px;
    justify-content: flex-start;
  }
  &.is-out {
    right: -7px;
    justify-content: flex-end;
  }
}

.gnode-label {
  display: flex;
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
}
.gnode-key {
  .gnode-value + &,
  &:has(+ .gnode-value) {
    color: var(--ink-dim);
  }
}
.gnode-value {
  color: var(--ink-strong);
  overflow: hidden;
  text-overflow: ellipsis;
}

.gnode-field {
  flex: 1;
  min-width: 0;
  max-width: 96px;
  margin-left: auto;
}
.gnode-control {
  padding: 4px 12px;
}
</style>
