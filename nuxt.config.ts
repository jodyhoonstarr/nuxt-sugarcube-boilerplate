import sugarcube from "@sugarcube-sh/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [sugarcube()],
  },
  css: [
    "./styles/global/global.css",
    "./styles/compositions/flow.css",
    "./styles/compositions/cluster.css",
  ],
})
