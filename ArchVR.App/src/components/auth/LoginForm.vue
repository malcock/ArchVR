<script setup lang="ts">
const { status, data, signIn, signOut, lastRefreshedAt, getProviders } =
  useAuth();

const credentialsModel = reactive({
  email: "",
  password: "",
});

const credentialsSignIn = async () => {
  const e = await signIn("credentials", {
    email: credentialsModel.email,
    password: credentialsModel.password,
    callbackUrl: "/",
  });
  console.log(e);
};

const providers = await getProviders().then((p) => {
  const { credentials, ...rest } = p;

  return {
    credentials,
    oauthProviders: rest,
  };
});
</script>

<template>
  <div class="base-200 rounded-md flex flex-col p-4 w-96 mx-auto">
    <form @submit.prevent="credentialsSignIn">
      <h3 class="text-2xl mb-4">Login</h3>
      <label class="mb-4 field">
        Email
        <input
          class="input"
          type="email"
          placeholder="me@email.com"
          v-model="credentialsModel.email"
          id="email"
          name="email"
          required
          aria-required="true"
        />
      </label>
      <label class="mb-4 field">
        Password
        <input
          class="input"
          type="password"
          v-model="credentialsModel.password"
          id="password"
          name="password"
          required
          aria-required="true"
        />
      </label>
      <div class="flex w-full justify-between">
        <NuxtLink to="/register" class="btn">Register</NuxtLink>
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </form>
    <template v-if="providers.oauthProviders">
      <p class="text-center my-4">- or -</p>
      <div class="auth-providers">
        <button
          class="btn w-full"
          v-for="provider in providers.oauthProviders"
          type="button"
          @click="signIn(provider!.id)"
        >
          Sign in with {{ provider?.name }}
        </button>
      </div>
    </template>
  </div>
</template>

<style></style>
