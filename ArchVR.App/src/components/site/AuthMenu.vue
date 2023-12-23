<script lang="ts" setup>
const { lastRefreshedAt, status, data, signOut } = useAuth();

const isAuthenticated = computed(() => status.value === "authenticated");
const menu = ref(null);
const authMenuItems = ref([
  {
    label: "Profile",
    icon: "pi pi-refresh",
    url: "/auth/profile",
  },
  {
    label: "Logout",
    icon: "pi pi-upload",
    command: () => signOut(),
  },
]);

//@ts-ignore - can't be bothered to fix this properly right now
const toggle = (event) => {
  //@ts-ignore - can't be bothered to fix this properly right now
  menu.value!.toggle(event);
};
</script>

<template>
  <div class="auth ml-16">
    <template v-if="isAuthenticated">
      <Button
        label="Primary"
        text
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        class="px-2"
      >
        <Avatar
          :image="(data!.user!.image as string)"
          class="!-ml-2 mr-2"
          size="normal"
          shape="circle"
        />
        {{ data?.user?.name || data?.user?.email }}
      </Button>
      <Menu ref="menu" id="auth_menu" popup :model="authMenuItems" />
    </template>
    <div class="space-x-4" v-else>
      <NuxtLink class="text-black dark:text-white" to="/auth/login"
        >Sign in</NuxtLink
      >
      <NuxtLink class="text-black dark:text-white" to="/auth/register"
        >Sign up</NuxtLink
      >
    </div>
  </div>
</template>

<style></style>
