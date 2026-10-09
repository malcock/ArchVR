<script setup lang="ts">
import { type TableField, type TableRow, type TableHeading } from "../../types";
const props = defineProps<{
  items: Array<TableRow>;
  fields?: Array<TableField>;
}>();

const cols = computed(() => props.fields || Object.keys(props.items[0]));

const headings = computed<Array<TableHeading>>(() =>
  props.fields
    ? props.fields.map((x) => ({
        ...x,
        label: x.label || x.key,
      }))
    : props.items && props.items.length > 0
    ? Object.keys(props.items[0]).map((x) => ({ key: x, label: x }))
    : []
);

const cellValue = (
  row: Record<string, unknown>,
  key: string,
  index: number
) => {
  const heading = headings.value.find((x) => x.key === key);
  return {
    item: row,
    index,
    value: row[key],
    field: {
      key: heading?.key,
      label: heading?.label,
    },
  };
};
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="heading in headings" :key="heading.key">
          <span>{{ heading.label }}</span>
          <button
            v-if="heading.sortable"
            class="btn btn-xs btn-square btn-ghost"
          >
            <icon class="!text-sm">swap_vert</icon>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in items">
        <td v-for="heading in headings">
          <slot
            :name="`cell(${heading.key})`"
            v-bind="cellValue(row, heading.key, index)"
          >
            <slot name="cell()" v-bind="cellValue(row, heading.key, index)">{{
              row[heading.key]
            }}</slot>
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
.table {
  th {
    vertical-align: middle;
    color: var(--ink-dim);
    font-weight: 500;
  }
  td a {
    @apply font-medium transition-colors;
    color: var(--ink-strong);

    &:hover {
      color: oklch(var(--p));
    }
  }
  :where(thead, tbody) :where(tr:not(:last-child)),
  :where(thead, tbody) :where(tr:first-child:last-child) {
    border-color: var(--hairline);
  }
}
</style>
