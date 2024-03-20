<script setup lang="ts">
import { computed } from "vue";
import type { IfcMaterialLayerSetUsage } from "~archvr3d";
import { EditorApp } from "~archvr3d";
const props = defineProps<{
  materialSet: IfcMaterialLayerSetUsage;
}>();

const preppedSet = computed(() => {
  let width = props.materialSet.IfcMaterialLayer.map(
    (x) => x.LayerThickness
  ).reduce((a, b) => a + b, 0);

  const layers = props.materialSet.IfcMaterialLayer.map(
    ({ Name, LayerThickness }) => {
      const tokens = Name.toLowerCase().split(" ");

      let col = "hsla(" + Math.random() * 360 + ", 100%, 50%, 1)";
      const colors = JSON.parse(JSON.stringify(EditorApp.layerColors));
      for (var i = 0; i < tokens.length; i++) {
        if (colors[tokens[i]]) {
          col = colors[tokens[i]].shift();
          continue;
        }
      }

      col = `background:${col};`;

      let w = `width:${(LayerThickness / width) * 100}%`;

      let Style = col + w;

      return {
        Name,
        LayerThickness: LayerThickness * 1000,
        Style,
      };
    }
  );

  return {
    ...props.materialSet,
    width,
    IfcMaterialLayer: layers,
  };
});
</script>

<template>
  <div class="ifcMatLayer">
    <EditorCoreField
      label="Name"
      v-model="preppedSet.LayerSetName"
      type="text"
    />
    <div class="ifcMatLayer-diagram">
      <button
        v-for="layer in preppedSet.IfcMaterialLayer"
        class="ifcMatLayer-btn"
        :title="`${layer.Name} - ${layer.LayerThickness}mm`"
        :style="layer.Style"
        type="button"
      />
    </div>
    <div class="ifcMatLayer-list">
      <EditorCoreField
        v-for="layer in preppedSet.IfcMaterialLayer"
        :label="layer.Name"
        type="text"
        v-model="layer.LayerThickness"
        disabled
      />
    </div>
  </div>
</template>

<style>
.ifcMatLayer {
  &-diagram {
    @apply p-0;
  }
  &-btn {
    @apply h-10 p-0 rounded-none;
  }
}
</style>
