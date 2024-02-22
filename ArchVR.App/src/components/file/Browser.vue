<script setup lang="ts">
import { type File as PrismaFile } from "@prisma/client";

const trpc = useTrpc();
let files = ref<PrismaFile[]>([]);

const getFiles = async () => {
  const q = trpc().file.list.query;

  files.value = (await trpc().file.list.query({})).items;
};

onMounted(() => getFiles());

const emit = defineEmits<{ selected: [data: PrismaFile] }>();
</script>

<template>
  <CoreGrid size="md" :items="files">
    <template #item="data: PrismaFile">
      <button
        @click="emit('selected', data)"
        class="card card_file bg-base-100"
      >
        <img class="thumb" :src="data.thumbnail" :alt="data.name" />
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
