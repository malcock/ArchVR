<script setup lang="ts">
const props = defineProps({
  title: {
    required: false,
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
  imageAlt: {
    type: String,
    required: false,
  },
});

const slots = useSlots();
</script>

<template>
  <div class="card panel">
    <figure v-if="image">
      <img :src="image" :alt="imageAlt" />
    </figure>
    <div class="card-body">
      <slot name="title"
        ><h2 class="card-title">{{ title }}</h2></slot
      >
      <div v-if="slots.topActions" class="card-actions justify-end">
        <slot name="topActions"></slot>
      </div>
      <slot name="content"> </slot>
      <div v-if="slots.bottomActions" class="card-actions justify-end">
        <slot name="bottomActions" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
