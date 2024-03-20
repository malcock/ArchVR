<script setup lang="ts">
import type { IfcPropertySet } from "~archvr3d";

import IfcGroup from "./IfcGroup.vue";

const props = defineProps<{
  propset: IfcPropertySet;
}>();
</script>

<template>
  <IfcGroup :title="propset.Name" class="!m-0">
    <EditorCoreField
      v-for="valPair in propset?.IfcPropertySingleValue"
      :label="valPair.Name"
      type="text"
      v-model="valPair.NominalValue"
    />
  </IfcGroup>
</template>

<style></style>
