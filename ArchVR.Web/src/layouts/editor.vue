<script setup lang="ts"></script>

<template>
  <div class="layout-default">
    <SiteHeader />
    <AuthMenu />
    <main class="editor">
      <Suspense>
        <router-view />
      </Suspense>
    </main>
  </div>
</template>

<style>
main.editor {
  margin: 0;
}
</style>
