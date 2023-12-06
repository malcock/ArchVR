<script setup lang="ts">
import { reactive } from "vue";
import useApi from "../../composables/useApi";
console.log({ BASE_URL: process.env.BASE_URL });
const api = useApi(process.env.BASE_URL as string);
const model = reactive({
  email: "user@example.com",
  password: "string",
});

const login = async () => {
  const { data, error } = await api.auth.login.post({
    email: model.email,
    password: model.password,
  });
  if (!error && data) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }
};
</script>

<template>
  <form @submit.prevent="login">
    <label>
      Email
      <input v-model="model.email" type="email" />
    </label>
    <label>
      password
      <input v-model="model.password" type="password" />
    </label>
    <button>Login</button>
  </form>
</template>

<style lang="postcss"></style>
