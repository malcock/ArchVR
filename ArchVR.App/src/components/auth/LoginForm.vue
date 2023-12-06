<script setup lang="ts">
const {
  status,
  data,
  signIn,
  signOut,
  lastRefreshedAt,
  getProviders,
  getCsrfToken,
} = useAuth();

const credentialsModel = reactive({
  email: "",
  password: "",
});

const credentialsSignIn = async () => {
  const e = await signIn("credentials", {
    email: credentialsModel.email,
    password: credentialsModel.password,
  });
  console.log(e);
};

const providers = await getProviders();
</script>

<template>
  <form @submit.prevent="credentialsSignIn">
    <label>
      Email
      <input
        type="email"
        placeholder="me@email.com"
        v-model="credentialsModel.email"
        id="email"
        name="email"
        required
        aria-required="true"
      />
    </label>
    <label>
      Password
      <input
        type="password"
        v-model="credentialsModel.password"
        id="password"
        name="password"
        required
        aria-required="true"
      />
    </label>
    <button type="submit">Login</button>
    <div class="auth-providers">
      <button
        v-for="provider in providers"
        type="button"
        @click="signIn(provider?.type)"
      >
        Sign in with {{ provider?.name }}
      </button>
    </div>
  </form>
</template>

<style></style>
