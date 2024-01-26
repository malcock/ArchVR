<script lang="ts" setup>
const { lastRefreshedAt, status, data, signOut } = useAuth();

const isAuthenticated = computed(() => status.value === "authenticated");

const initial = computed(() =>
  (data.value?.user?.name || data.value?.user?.email)?.charAt(0)
);
</script>

<template>
  <div class="auth ml-16">
    <template v-if="isAuthenticated">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost">
          <span class="hidden md:inline">{{
            data?.user?.name || data?.user?.email
          }}</span>
          <div v-if="data!.user!.image" class="avatar">
            <div class="w-8 rounded-full">
              <img :src="(data!.user!.image as string)" />
            </div>
          </div>
          <div v-else class="avatar placeholder">
            <div class="w-8 bg-neutral text-neutral-content rounded-full">
              <span>{{ initial }}</span>
            </div>
          </div>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><NuxtLink to="/auth/profile">Profile</NuxtLink></li>
          <li><a @click="signOut()">Logout</a></li>
        </ul>
      </div>
      <!-- <Button
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
      <Menu ref="menu" id="auth_menu" popup :model="authMenuItems" /> -->
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
