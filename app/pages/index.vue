<script setup lang="ts">
const router = useRouter()
const routes = router.getRoutes()
</script>

<template>
  <article class="wrapper flow">
    <h1>Nuxt & SugarCube</h1>
    <h2>Examples:</h2>
    <ul>
      <li v-for="route in routes.filter((r) => r.path !== '/')" :key="route.path">
        <nuxt-link :to="route.path">
          {{ route.path.substring(1) }}
        </nuxt-link>
      </li>
    </ul>
  </article>
</template>
