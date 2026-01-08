<script setup></script>
<script setup lang="js">
import AccessibilityMenu from './components/AccessibilityMenu.vue'
</script>


<template>
  <div id="app">
    <AccessibilityMenu />
    <router-view />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped></style>
