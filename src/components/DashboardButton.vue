<script setup>
    import '@/assets/css/admin/admin-button-dashboard.css'
    import { Icon } from "@iconify/vue";

    defineProps({
        label: String,
        route: String,
        icon_name: String
    })
</script>

<template>
  <div
    class="dashboard-card card shadow-sm text-center p-3"
    role="button"
    tabindex="0"
    @click="$router.push(route)"
    @keyup.enter="$router.push(route)">
    <div class="icon-container">
      <Icon :icon="icon_name" width="32px" height="32px"/>
    </div>

    <main class="card-body">
      <h6 class="card-title fw-bold">
        {{ label }}
      </h6>
    </main>
</div>
</template>