<script lang="ts" setup>
const { data, status } = useAuth();

const { $client } = useNuxtApp();

const user = reactive({
  email: data.value?.user?.email,
  image: data.value?.user?.image,
  name: data.value?.user?.name,
});

const updateUser = async () => {
  // $client.user.updateUser.mutate({});
};
</script>

<template>
  <form @submit.prevent="updateUser" class="space-y-4">
    <label class="field">
      Name
      <input
        class="input"
        type="email"
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
