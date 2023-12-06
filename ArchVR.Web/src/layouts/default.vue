<script setup lang="ts"></script>

<template>
  <div class="layout-default">
    <SiteHeader />
    <AuthMenu />
    <main class="main">
      <Suspense>
        <router-view />
      </Suspense>
    </main>
  </div>
</template>

<style>
main.main {
  margin-top: 6rem;
}
</style>
