<script setup lang="ts">
const router = useRouter()
const routes = router.getRoutes()
</script>

<template>
  <div>
    <h1>
      Nuxt + SugarCube
    </h1>
    <h2>
      Pages:
    </h2>
    <ol>
      <li>
        <nuxt-link :to="'/'">
          Home
        </nuxt-link>
      </li>
      <li v-for="route in routes.filter((r) => r.path !== '/')" :key="route.path">
        <nuxt-link :to="route.path">
          {{ route.path.substring(1) }}
        </nuxt-link>
      </li>
    </ol>
  </div>
</template>