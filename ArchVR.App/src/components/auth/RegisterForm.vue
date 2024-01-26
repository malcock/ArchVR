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
  console.log("reg user");
  $fetch("/api/auth/register", {
    method: "POST",
    body: credentialsModel,
  })
    .then(async (res) => {
      console.log(res);
      //automatically sign in
      console.log("signing in");
      await signIn("credentials", {
        email: credentialsModel.email,
        password: credentialsModel.password,
      });
      router.push("/welcome");
    })
    .catch((err) => {
      console.log("fetch err", { err });
    });
};
</script>

<template>
  <Card class="max-w-lg mx-auto" title="Register">
    <template #content>
      <form @submit.prevent="registerUser" class="space-y-8">
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
              >Your favourite email</span
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
          </div>
        </label>
        <div class="flex justify-between">
          <button
            @click="$router.push('/auth/login')"
            class="btn btn-link"
            type="button"
            tabindex="-1"
            to="/auth/register"
          >
            Login
          </button>
          <button class="btn btn-primary" type="submit">Register</button>
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
  <!-- <h3 class="text-2xl mb-4">Register</h3>
  <form
    @submit.prevent="registerUser"
    class="base-200 rounded-md flex flex-col p-4 w-96 mx-auto"
  >
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
      <NuxtLink to="/auth/login" class="btn">Login</NuxtLink>
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
  </form> -->
</template>

<style></style>
