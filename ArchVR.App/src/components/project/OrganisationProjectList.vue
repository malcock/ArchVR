<script setup lang="ts">
import type PaginatedResponse from "~/services/types/PaginatedResponse";
import { type Project } from "@prisma/client";
import type { CoreDialog } from "#build/components";
import { type TableHeading } from "~/types";
const modal = ref<InstanceType<typeof CoreDialog>>();
const trpc = useTrpc();

let projects = ref<Project[]>([]);

const getProjects = async () => {
  projects.value = (await trpc().project.list.query({})).items;
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
  getProjects();
});
</script>

<template>
  <Card title="Projects">
    <template #title
      ><div class="flex justify-between">
        <h2 class="card-title">Projects</h2>
        <button @click="modal!.show()" class="btn btn-primary">New</button>
      </div>
    </template>
    <template #content
      ><CoreTable :items="projects" :fields="fields">
        <template #cell(name)="data">
          <NuxtLink :to="`/app/project/${data.item.id}`">{{
            data.value
          }}</NuxtLink>
        </template>
        <template #cell(createdAt)="data">
          {{ new Date(data.value as string).toLocaleString() }}</template
        >
      </CoreTable>
      <CoreDialog ref="modal" @cancel="getProjects" @confirm="getProjects">
        <template #form>
          <ProjectFormsNewProject dialog />
        </template>
      </CoreDialog>
    </template>
  </Card>
</template>

<style></style>
