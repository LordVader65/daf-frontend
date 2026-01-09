<script setup lang="js">
import Header from './components/Header.vue'
import AccessibilityMenu from './components/AccessibilityMenu.vue'
</script>

<template>
  <div id="app">
    <Header />
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
