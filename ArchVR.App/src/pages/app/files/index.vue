<script setup lang="ts">
import type { FileUploader } from "#build/components";

const fileUploader = ref<InstanceType<typeof FileUploader> | null>(null);
</script>

<template>
  <div class="my-8">
    <Card title="Files"
      ><template #content>
        <FileBrowser />
        <FileUploader ref="fileUploader" />
      </template>
    </Card>
  </div>
</template>

<style></style>
