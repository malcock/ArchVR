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
  <Card class="max-w-lg mx-auto">
    <template #title> Login </template>
    <template #content>
      <form @submit.prevent="credentialsSignIn" class="space-y-8">
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="credentialsModel.email"
            aria-describedby="email-help"
          />
          <small id="email-help">Your email address</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="email">Password</label>
          <InputText
            id="password"
            v-model="credentialsModel.password"
            type="password"
            aria-describedby="password-help"
          />
          <small id="password-help" class="flex justify-between"
            ><span>Your super secret password</span>
            <NuxtLink
              to="/auth/forgot-password"
              tabindex="-1"
              class="text-right"
              >Forgotten password?</NuxtLink
            ></small
          >
        </div>
        <div class="flex justify-between">
          <Button
            @click="$router.push('/auth/register')"
            text
            type="button"
            tabindex="-1"
            to="/auth/register"
            >Register</Button
          >
          <Button type="submit">Login</Button>
        </div>
      </form>

      <template v-if="providers.oauthProviders">
        <Divider>OR</Divider>
        <div class="auth-providers">
          <Button
            plain
            class="btn w-full"
            v-for="provider in providers.oauthProviders"
            type="button"
            @click="signIn(provider!.id)"
          >
            Sign in with {{ provider?.name }}
          </Button>
        </div>
      </template>
    </template>
  </Card>
  <!-- <div class="base-200 rounded-md flex flex-col p-4 w-96 mx-auto relative">
    <h3 class="text-2xl mb-4">Login</h3>
    <form @submit.prevent="credentialsSignIn">
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
        <NuxtLink to="/auth/forgot-password" tabindex="-1" class="text-right"
          >Forgotten password?</NuxtLink
        >
      </label>
      <div class="flex w-full justify-between">
        <NuxtLink to="/auth/register" class="btn">Register</NuxtLink>
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
  </div> -->
</template>

<style></style>
