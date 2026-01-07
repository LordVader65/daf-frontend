<template>
  <section class="accesibility-menu">
    <button 
      class="ic-hi-con" 
      aria-label="Activar alto contraste" 
      :aria-pressed="isHighContrast"
      @click="toggleHighContrast">
      <img src="/images/accesibility/high-contrast-icon.svg" alt="Alto Contraste">
    </button>

    <button 
      class="ic-si-inc" 
      aria-label="Aumentar tamaño del texto"
      @click="increaseTextSize"
    >
      <img src="/images/accesibility/size-increase-icon.svg" alt="Escalar texto">
    </button>

    <button 
      class="ic-si-dec" 
      aria-label="Disminuir tamaño del texto"
      @click="decreaseTextSize"
    >
      <img src="/images/accesibility/size-decrease-icon.svg" alt="Disminuir texto">
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import $ from 'jquery'

const isHighContrast = ref(false)

const toggleHighContrast = () => {
  $("body").toggleClass("high-contrast")
  isHighContrast.value = !isHighContrast.value
}

const increaseTextSize = () => {
  const root = document.documentElement
  let size = parseFloat(
    getComputedStyle(root).getPropertyValue("--text-size")
  )

  if (size < 1.75) {
    root.style.setProperty("--text-size", (size + 0.25) + "em")
  }
}

const decreaseTextSize = () => {
  const root = document.documentElement
  let size = parseFloat(
    getComputedStyle(root).getPropertyValue("--text-size")
  )

  if (size > 1) {
    root.style.setProperty("--text-size", (size - 0.25) + "em")
  }
}

onMounted(() => {
  const root = document.documentElement
  root.style.setProperty("--text-size", "1em")
})
</script>