<script setup lang="ts">
import { type File as PrismaFile } from "@prisma/client";

const trpc = useTrpc();
let files = ref<PrismaFile[]>([]);

const getFiles = async () => {
  const q = trpc().file.list.query;

  files.value = (await trpc().file.list.query({})).items;
};

const currentFile = ref<PrismaFile | null>(null);

onMounted(() => getFiles());

const emit = defineEmits<{ selected: [data: PrismaFile] }>();

const selectFile = (data: PrismaFile) => {
  currentFile.value = data;
  emit("selected", data);
};

const getThumbnail = (path: string | null = null) => {
  return path || "/nothumb.png";
};
</script>

<template>
  <CoreGrid size="md" :items="files">
    <template #item="data: PrismaFile">
      <button
        type="button"
        @click="selectFile(data)"
        class="card card_file bg-base-200"
        :class="{
          'is-selected': currentFile && currentFile.id === data.id,
        }"
      >
        <img
          class="thumb"
          :src="getThumbnail(data.thumbnail)"
          :alt="data.name"
        />
        <p class="text-sm mt-2">{{ data.name }}</p>
        <p class="text-xs" style="color: var(--ink-dim)">
          Uploaded: {{ new Date(data.createdAt).toLocaleString() }}
        </p>
      </button>
    </template>
  </CoreGrid>
</template>

<style>
.card {
  &_file {
    @apply rounded-lg p-2 text-left transition-colors;
    border: 1px solid var(--hairline);

    &:hover {
      border-color: var(--hairline-strong);
    }
    &.is-selected {
      border-color: oklch(var(--p));
      box-shadow: 0 0 0 1px oklch(var(--p));
    }
    .thumb {
      @apply rounded w-full;
    }
  }
}
</style>
