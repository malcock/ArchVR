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
    class="select bg-base-300 select-xs"
    :id="data.id"
  >
    <option v-for="opt in data.options" :value="opt.value">
      {{ opt.text }}
    </option>
  </select>
</template>

<style lang="postcss"></style>
