<script setup lang="js">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <Header />

    <AccessibilityMenu />

    <!-- CONTENIDO DINÁMICO -->
    <main id="main-content">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* CLAVE: permite que las vistas se rendericen correctamente */
#main-content {
  flex: 1;
  display: block;
}
</style>
