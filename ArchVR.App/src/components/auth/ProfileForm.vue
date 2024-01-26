<script lang="ts" setup>
import useTrpc from "~/composables/useTrpc";
const { data, status, getSession, signIn } = useAuth();

const trpc = useTrpc();

const user = reactive({
  id: (data.value?.user! as any).id,
  email: data.value?.user?.email,
  image: data.value?.user?.image,
  name: data.value?.user?.name,
});

const updateUser = async () => {
  await trpc().user.updateUser.mutate({
    id: user.id as string,
    email: user.email as string,
    name: user.name as string,
  });
  //force update session to get new details
  await getSession({ force: true });
};
</script>

<template>
  <Card title="Profile">
    <template #content>
      <form @submit.prevent="updateUser" class="space-y-4">
        <label class="form-control">
          <div class="label">
            <span class="label-text">Name</span>
            <!-- <span class="label-text-alt">Top Right label</span> -->
          </div>
          <input
            class="input input-bordered"
            id="email"
            v-model="user.name"
            aria-describedby="name-help"
          />
          <div class="label">
            <span class="label-text-alt" id="name-help"
              >What would you like to be known as</span
            >
          </div>
        </label>

        <button class="btn btn-primary">Update</button>
      </form>
    </template>
  </Card>
</template>

<style lang="scss"></style>
