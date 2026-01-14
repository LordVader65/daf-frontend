<template>
  <section class="accessibility-menu">
      <button
        class="ic-hi-con" 
        aria-label="Activar alto contraste" 
        :aria-pressed="isHighContrast"
        @click="toggleHighContrast">
        <img src="/images/accessibility/high-contrast-icon.svg" alt="Alto Contraste">
      </button>

      <button
        class="ic-si-inc" 
        aria-label="Aumentar tamaño del texto"
        @click="increaseTextSize">
        <img src="/images/accessibility/size-increase-icon.svg" alt="Escalar texto">
      </button>
      <button
        class="ic-si-dec" 
        aria-label="Disminuir tamaño del texto"
        @click="decreaseTextSize">
        <img src="/images/accessibility/size-decrease-icon.svg" alt="Disminuir texto">
      </button>
  </section>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import $ from 'jquery'

const isHighContrast = ref(false)

const toggleHighContrast = () => {
  $("body").toggleClass("high-contrast")
  isHighContrast.value = !isHighContrast.value
  
  // Guardar estado en localStorage
  localStorage.setItem('highContrast', isHighContrast.value.toString())
}

const increaseTextSize = () => {
  const root = document.documentElement
  let size = parseFloat(
    getComputedStyle(root).getPropertyValue("--text-size")
  )

  if (size < 1.75) {
    size += 0.25
    root.style.setProperty("--text-size", size + "em")
    localStorage.setItem('textSize', size.toString())
  }
}

const decreaseTextSize = () => {
  const root = document.documentElement
  let size = parseFloat(
    getComputedStyle(root).getPropertyValue("--text-size")
  )

  if (size > 1) {
    size -= 0.25
    root.style.setProperty("--text-size", size + "em")
    localStorage.setItem('textSize', size.toString())
  }
}

onMounted(() => {
  const root = document.documentElement
  
  // Cargar tamaño del texto desde localStorage
  const savedTextSize = localStorage.getItem('textSize')
  if (savedTextSize) {
    root.style.setProperty("--text-size", savedTextSize + "em")
  } else {
    root.style.setProperty("--text-size", "1em")
  }
  
  // Cargar estado de alto contraste desde localStorage
  const savedHighContrast = localStorage.getItem('highContrast')
  if (savedHighContrast === 'true') {
    isHighContrast.value = true
    $("body").addClass("high-contrast")
  }
})
</script>