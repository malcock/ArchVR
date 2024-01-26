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
  <Card class="max-w-lg mx-auto" title="Login">
    <template #content>
      <form @submit.prevent="credentialsSignIn" class="space-y-8">
        <label class="form-control">
          <div class="label">
            <span class="label-text">Email</span>
            <!-- <span class="label-text-alt">Top Right label</span> -->
          </div>
          <input
            class="input input-bordered"
            id="email"
            v-model="credentialsModel.email"
            aria-describedby="email-help"
          />
          <div class="label">
            <span class="label-text-alt" id="email-help"
              >The email you signed up with</span
            >
          </div>
        </label>

        <label class="form-control">
          <div class="label">
            <span class="label-text">Password</span>
            <!-- <span class="label-text-alt">Top Right label</span> -->
          </div>
          <input
            class="input input-bordered"
            id="password"
            v-model="credentialsModel.password"
            type="password"
            aria-describedby="password-help"
          />
          <div class="label">
            <span class="label-text-alt" id="password-help"
              >Your super secret password</span
            >
            <span class="label-text-alt"
              ><NuxtLink to="/auth/forgot-password" tabindex="-1" class="link"
                >Forgotten password?</NuxtLink
              ></span
            >
          </div>
        </label>

        <div class="flex justify-between">
          <button
            @click="$router.push('/auth/register')"
            class="btn btn-link"
            type="button"
            tabindex="-1"
            to="/auth/register"
          >
            Register
          </button>
          <button class="btn btn-primary" type="submit">Login</button>
        </div>
      </form>

      <template v-if="providers.oauthProviders">
        <div class="divider">OR</div>
        <div class="auth-providers">
          <button
            class="btn btn-neutral w-full"
            v-for="provider in providers.oauthProviders"
            type="button"
            @click="signIn(provider!.id)"
          >
            Sign in with {{ provider?.name }}
          </button>
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
