<script lang="ts" setup>
const router = useRouter();
const props = defineProps({
  token: {
    required: false,
    type: String,
  },
  isReset: {
    required: false,
    type: Boolean,
  },
});

const model = reactive({
  password: "",
  confirmPassword: "",
  token: props.token,
});

const resetPassword = async () => {
  const res = $fetch("/api/auth/reset-password", {
    method: "POST",
    body: model,
  })
    .then((res) => {
      router.push("/");
    })
    .catch((err) => {
      console.log("fetch error", { err });
    });
};
</script>

<template>
  <div class="base-200 rounded-md flex flex-col p-4 w-96 mx-auto relative">
    <h3 class="text-2xl mb-4">
      {{ isReset ? "Reset Password" : "New Password" }}
    </h3>

    <form @submit.prevent="resetPassword">
      <label class="mb-4 field">
        Password
        <input
          class="input"
          type="password"
          v-model="model.password"
          id="password"
          name="password"
          required
          aria-required="true"
        />
      </label>
      <label class="mb-4 field">
        Confirm Password
        <input
          class="input"
          type="password"
          v-model="model.confirmPassword"
          id="confirmPassword"
          name="confirmPassword"
          required
          aria-required="true"
        />
      </label>
      <div class="flex w-full justify-between">
        <NuxtLink to="/auth/login" class="btn">Login</NuxtLink>
        <button type="submit" class="btn btn-primary">Set Password</button>
      </div>
    </form>
  </div>
</template>

<style></style>
