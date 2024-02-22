<script lang="ts" setup>
const { lastRefreshedAt, status, data, signOut } = useAuth();

const isAuthenticated = computed(() => status.value === "authenticated");

const authItems = ref([
  {
    label: "Projects",
    url: "/app",
    children: [],
  },
  {
    label: "Files",
    url: "/app/files",
    children: [],
  },
]);

const unAuthedItems = ref([]);

const items = computed(() =>
  isAuthenticated.value ? authItems.value : unAuthedItems.value
);

// const items = ref([
//   {
//     label:"Projects",
//     url:'/projects'
//   },
//   {
//     label: "Home",
//     icon: "pi pi-home",
//     url: "/",
//   },
//   {
//     label: "Protected Page",
//     icon: "pi pi-star",
//     url: "/app",
//   },
//   {
//     label: "Unprotected",
//     icon: "pi pi-star",
//     url: "/unprotected",
//   },
//   {
//     label: "Unauthed only",
//     icon: "pi pi-star",
//     url: "/unauthed",
//   },
//   {
//     label: "Profile",
//     icon: "pi pi-star",
//     url: "/auth/profile",
//   },
// ]);
</script>

<template>
  <header class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li v-for="i in items">
            <NuxtLink :to="i.url">{{ i.label }}</NuxtLink>
            <ul v-if="i.children.length">
              <li v-for="i in items">
                <NuxtLink :to="i.url">{{ i.label }}</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl" href="/">TDVP</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-for="i in items">
          <NuxtLink :to="i.url">{{ i.label }}</NuxtLink>
          <ul v-if="i.children.length">
            <li v-for="i in items">
              <NuxtLink :to="i.url">{{ i.label }}</NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <SiteAuthMenu />
    </div>
  </header>
</template>

<style></style>
