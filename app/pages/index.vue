<script setup lang="ts">
const router = useRouter()
const routes = router.getRoutes()
</script>

<template>
  <div>
    <h1 class="text-black border-primary bg-secondary">
      Nuxt + SugarCube
    </h1>
    <h2 class="bg-secondary">
      Pages:
    </h2>
    <ol class="bg-black text-white">
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
    <div id="thing" class="border-primary bg-secondary">
      I'm a thing
    </div>
  </div>
</template>

<style lang="css">
/* make the thing have a border witdth */
#thing {
  border-width: 2px;
  border-style: solid;
}
</style>