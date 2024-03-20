<script setup lang="ts">
import type { IfcAbstractType } from "~archvr3d";

const props = defineProps<{
  property: IfcAbstractType;
}>();
</script>

<template>
  <EditorCoreField
    v-for="key in Object.keys(property)"
    :label="key"
    v-model="property[key]"
    type="text"
  />
</template>

<style></style>
