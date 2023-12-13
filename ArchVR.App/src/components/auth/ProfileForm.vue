<script lang="ts" setup>
import chalk from "chalk";
import useTprc from "~/composables/useTrpc";
const { data, status, getSession, signIn } = useAuth();

const tprc = useTprc();

const user = reactive({
  id: (data.value?.user! as any).id,
  email: data.value?.user?.email,
  image: data.value?.user?.image,
  name: data.value?.user?.name,
});

const updateUser = async () => {
  await tprc().user.updateUser.mutate({
    id: user.id as string,
    email: user.email as string,
    name: user.name as string,
  });
  //force update session to get new details
  await getSession({ force: true });
};
</script>

<template>
  <form @submit.prevent="updateUser" class="space-y-4">
    <label class="field">
      Name
      <input
        class="input"
        v-model="user.name"
        id="email"
        name="email"
        required
        aria-required="true"
      />
    </label>
    <label class="field">
      Email
      <input
        class="input"
        type="email"
        v-model="user.email"
        id="email"
        name="email"
        required
        aria-required="true"
      />
    </label>

    <button type="submit" class="btn btn-primary">Update</button>
  </form>
</template>

<style lang="scss"></style>
