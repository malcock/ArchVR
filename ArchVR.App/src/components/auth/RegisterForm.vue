<script lang="ts" setup>
const {
  status,
  data,
  signIn,
  signOut,
  lastRefreshedAt,
  getProviders,
  getCsrfToken,
} = useAuth();

const router = useRouter();

const credentialsModel = reactive({
  email: "",
  password: "",
});

const providers = await getProviders().then((p) => {
  const { credentials, ...rest } = p;

  return {
    credentials,
    oauthProviders: rest,
  };
});

const csrfToken = await getCsrfToken();

const registerUser = async () => {
  const res = useFetch("/api/auth/register", {
    method: "POST",
    body: credentialsModel,
  }).then(async (res) => {
    if (res.error) {
      //TODO: Do something!
      return;
    }
    //automatically sign in
    console.log("signing in");
    await signIn("credentials", {
      email: credentialsModel.email,
      password: credentialsModel.password,
    });
    router.push("/welcome");
  });
};
</script>

<template>
  <form
    @submit.prevent="registerUser"
    class="base-200 rounded-md flex flex-col p-4 w-96 mx-auto"
  >
    <h3 class="text-2xl mb-4">Register</h3>
    <input type="hidden" :value="csrfToken" name="csrfToken" />
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
      <NuxtLink to="/login" class="btn">Login</NuxtLink>
      <button type="submit" class="btn btn-primary">Register</button>
    </div>
    <template v-if="providers.oauthProviders">
      <p class="text-center my-4">- or -</p>
      <div class="auth-providers">
        <button
          class="btn w-full"
          v-for="provider in providers.oauthProviders"
          type="button"
          @click="signIn(provider?.type)"
        >
          Sign in with {{ provider?.name }}
        </button>
      </div>
    </template>
  </form>
</template>

<style></style>
