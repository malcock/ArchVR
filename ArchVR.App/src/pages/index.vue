<script setup lang="ts">
const { signIn } = useAuth();
const bblah = () => {
  console.log("bblah");

  signIn();
};
</script>

<template>
  <h1>Hello</h1>
  <button @click="bblah">Signin</button>
</template>

<style lang="postcss"></style>
