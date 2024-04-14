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
        class="card card_file bg-base-100 border-2 border-base-200"
        :class="{
          '!border-primary': currentFile && currentFile.id === data.id,
        }"
      >
        <img
          class="thumb"
          :src="getThumbnail(data.thumbnail)"
          :alt="data.name"
        />
        <p class="text-sm mt-2">{{ data.name }}</p>
        <p class="text-xs text-neutral-content">
          Uploaded: {{ new Date(data.createdAt).toLocaleString() }}
        </p>
      </button>
    </template>
  </CoreGrid>
</template>

<style>
.card {
  &_file {
    @apply rounded-sm p-2;

    .thumb {
      @apply rounded-sm;
    }
  }
}
</style>
