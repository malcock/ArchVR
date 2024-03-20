<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="collapse collapse-plus bg-base-200 ifcgroup">
    <input type="checkbox" class="ifcgroup-checkbox" />
    <div class="collapse-title p-2 text-xs font-medium">
      {{ title }}
    </div>
    <div class="collapse-content p-0 bg-base-200 join join-vertical">
      <div class="ifcgroup-content">
        <slot>hi</slot>
      </div>
    </div>
  </div>
</template>

<style>
.ifcgroup {
  @apply mb-2 !w-auto;

  .collapse-title,
  :where(.collapse > input[type="checkbox"]),
  :where(.collapse > input[type="radio"]) {
    @apply min-h-0 !w-auto;
  }

  &.collapse-plus .collapse-title:after {
    top: 0.4rem;
  }
  /* &[open] :where(.collapse-content),
  .collapse-open :where(.collapse-content),
  &:focus:not(.collapse-close) :where(.collapse-content),
  &:not(.collapse-close)
    :where(input[type="checkbox"]:checked ~ .collapse-content),
  &:not(.collapse-close)
    :where(input[type="radio"]:checked ~ .collapse-content) {
    @apply p-1;
  } */
  &-content {
    @apply py-2 px-1;
  }
}
</style>
