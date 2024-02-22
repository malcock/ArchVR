<script setup lang="ts">
import { z } from "zod";

const trpc = useTrpc();
const props = defineProps<{
  dialog: boolean;
  projectId: string;
}>();

const emit = defineEmits(["success", "cancel"]);

const { handleSubmit, defineField, errors, validate } = useForm({
  initialValues: {
    name: "",
  },

  validationSchema: toTypedSchema(
    z.object({ name: z.string().min(1, "Project name must not be empty") })
  ),
});

const [name, nameProps] = defineField("name");

const onSubmit = handleSubmit(
  async (values, ctx) => {
    console.log({ values });
    const { name } = values;
    await trpc().scene.create.mutate({ name, projectId: props.projectId });
    ((ctx.evt as SubmitEvent).target! as HTMLFormElement).submit();
    emit("success");
  },
  (err) => {
    console.log({ err });
  }
);
</script>

<template>
  <form :method="dialog ? 'dialog' : 'post'" @submit="onSubmit">
    <FormField label="Scene name" :error="errors.name">
      <input
        class="input input-bordered w-full"
        v-model="name"
        v-bind="nameProps"
      />
    </FormField>
    <div v-if="dialog" class="modal-action">
      <button class="btn btn-primary">Create</button>
    </div>
  </form>
</template>

<style></style>
