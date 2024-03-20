<script setup lang="ts">
import { nanoid } from "nanoid";
const props = withDefaults(
  defineProps<{
    modelValue: any;
    type:
      | "text"
      | "number"
      | "select"
      | "radio"
      | "checkbox"
      | "range"
      | "color"
      | "texture"
      | "material"
      | "vector";
    label: string;
    options?: Array<{ value: string | number | boolean; text: string }>;
    disabled?: boolean;
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    scale?: boolean;
    rotation?: boolean;
    position?: boolean;
  }>(),
  {
    disabled: false,
    type: "text",
    id: nanoid(),
  }
);

const emit = defineEmits(["update:modelValue", "change"]);
</script>

<template>
  <label class="field" :for="id">
    <template v-if="options">
      <span class="input-text">{{ label }}</span>
      <select
        v-if="type === 'select'"
        :value="modelValue"
        @input="
          emit('update:modelValue', $event.target!.value);
          emit('change', $event.target!.value);
        "
        class="select bg-base-300 select-xs"
        :id="id"
        :disabled="disabled"
      >
        <option v-for="opt in options" :value="opt.value">
          {{ opt.text }}
        </option>
      </select>
      <template v-else>
        <div class="form-control" v-for="opt in options">
          <label class="label cursor-pointer">
            <span class="label-text">{{ opt.text }}</span>
            <input
              type="radio"
              :id="id"
              :name="id"
              :value="opt.value"
              @input="$emit('update:modelValue', $event.target.value)"
            />
          </label>
          <input
            class="radio"
            type="radio"
            :id="id"
            :name="id"
            :value="opt.value"
            @input="$emit('update:modelValue', $event.target.value)"
          />
        </div>
      </template>
    </template>
    <template v-else>
      <template v-if="type === 'checkbox'">
        <input
          v-if="type === 'checkbox'"
          type="checkbox"
          class="checkbox"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <span class="input-text">{{ label }}</span>
      </template>
      <template v-else>
        <span class="input-text">{{ label }}</span>
        <input
          type="text"
          class="input bg-base-300 input-xs"
          :value="modelValue"
          :id="id"
          @input="
            $emit('update:modelValue', $event.target.value);
            emit('change', $event.target!.value);
          "
        />
      </template>
    </template>
  </label>
</template>

<style>
.field {
  @apply flex mb-2 items-center justify-end;

  input[type="text"],
  select {
    @apply w-7/12;
  }
}
.input-text {
  overflow: auto;
  @apply overflow-auto break-words w-5/12 px-1;
}
.input-text + .input-ctrl {
  @apply ml-2;
}
</style>
