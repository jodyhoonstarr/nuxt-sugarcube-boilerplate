<script setup>
// Sugarcube generated CSS (variables + utilities)
import "virtual:sugarcube.css";

// Global styles (order matters here so we don't use vite's built-in glob imports,
// just to be safe): https://vite.dev/guide/features#glob-import)
import './css/global/reset.css';
import './css/global/fonts.css';
import './css/global/variables.css';
import './css/global/global-styles.css';

import.meta.glob('./css/blocks/*.css', { eager: true });
import.meta.glob('./css/compositions/*.css', { eager: true });
import.meta.glob(['./css/utilities/*.css', '!**/*.gen.css'], { eager: true });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
