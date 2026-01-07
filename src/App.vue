<script setup></script>

<template>
  <div id="app">
    <router-view />
    <AccessibilityMenu />
  </div>
</template>

<script setup lang="js">
import AccessibilityMenu from './components/AccessibilityMenu.vue'
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped></style>
