<script setup lang="ts">
import { type Scene } from "@prisma/client";
import type { CoreDialog } from "#build/components";
import { type TableHeading } from "~/types";

const props = defineProps<{
  projectId: string;
}>();

const modal = ref<InstanceType<typeof CoreDialog>>();
const trpc = useTrpc();
let scenes = ref<Scene[]>([]);

const getScenes = async () => {
  scenes.value = (
    await trpc().scene.list.query({ projectId: props.projectId })
  ).items;
};

const fields = ref<TableHeading[]>([
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
]);

onMounted(() => {
  getScenes();
});
</script>

<template>
  <Card title="Scenes">
    <template #title>
      <div class="flex justify-between">
        <h2 class="card-title">Scenes</h2>
        <button @click="modal!.show()" class="btn btn-primary">New</button>
      </div>
    </template>
    <template #content>
      <CoreTable :items="scenes" :fields="fields">
        <template #cell(name)="data">
          <NuxtLink :to="`/app/project/${projectId}/${data.item.id}`">{{
            data.value
          }}</NuxtLink>
        </template>
      </CoreTable>
      <CoreDialog ref="modal" @cancel="getScenes" @confirm="getScenes">
        <template #form>
          <ProjectFormsNewScene :project-id="projectId" dialog />
        </template>
      </CoreDialog>
    </template>
  </Card>
</template>

<style lang="postcss"></style>
