<script lang="ts" setup>
import { type MenuItem } from "../core/MenuItem.vue";
import { EditorKey, EditorBus } from "@/composables/EditorKeys";

let editor = inject(EditorKey);
let bus = useEventBus(EditorBus);
const ready = ref(false);
editor?.onEditorReady.addOnce((val) => {
  ready.value = val;
});

const { lastRefreshedAt, status, data, signOut } = useAuth();

const isAuthenticated = computed(() => status.value === "authenticated");

const authItems = ref<MenuItem[]>([
  {
    label: "File",
    children: [
      {
        label: "New Scene",
      },
    ],
  },
  {
    label: "Add",
    children: [
      {
        label: "Model",
        action: () => bus.emit("model.new"),
      },
      { label: "Widget", action: () => bus.emit("widget.new") },
      { label: "Device", action: () => bus.emit("device.new") },
    ],
  },
  {
    label: "Object",
    children: [
      {
        label: "Add Object",
        action: () => console.log("open file browser"),
      },
    ],
  },
  {
    label: "Widget",
    children: [{ label: "Add Widget" }],
  },
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
</script>

<template>
  <header class="navbar site-bar bg-base-100" id="editorheader">
    <div class="navbar-start">
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-sm btn-square"
          aria-label="Menu"
        >
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
          <CoreMenuItem v-for="i in items" :item="i" />
        </ul>
      </div>
      <a v-if="!isAuthenticated" class="btn btn-ghost text-xl" href="/">TDVP</a>
    </div>
    <!-- <div class="navbar-center hidden lg:flex">
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
    </div> -->
    <div class="navbar-end">
      <SiteAuthMenu />
    </div>
  </header>
</template>

<style></style>
~/composables/EditorKeys
