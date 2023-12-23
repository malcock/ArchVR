<script lang="ts" setup>
const email = ref("");
const isSubmitted = ref(false);
const successful = ref(false);
const submit = async () => {
  isSubmitted.value = true;
  $fetch("/api/auth/forgot-password", {
    method: "POST",
    body: { email: email.value },
  })
    .then((res) => {
      isSubmitted.value = true;
      successful.value = true;
    })
    .catch((err) => {
      isSubmitted.value = false;
      successful.value = false;
      console.log("fetch error", { err });
    });
};
</script>

<template>
  <div class="base-200 rounded-md flex flex-col p-4 w-96 mx-auto">
    <h3 class="text-2xl mb-4">Forgotten Password</h3>
    <form @submit.prevent="submit" v-if="!isSubmitted && !successful">
      <label class="mb-4 field">
        Email
        <input
          class="input"
          type="email"
          placeholder="me@email.com"
          v-model="email"
          id="email"
          name="email"
          required
          aria-required="true"
        />
      </label>
      <div class="flex w-full justify-between">
        <NuxtLink to="/login" class="btn">Login</NuxtLink>
        <button type="submit" class="btn btn-primary">Reset password</button>
      </div>
    </form>
    <template v-else>
      <p class="mb-8">
        We have sent a password reset request to the email provided
      </p>
    </template>
  </div>
</template>

<style></style>
