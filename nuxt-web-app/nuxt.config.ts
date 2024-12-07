// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    googleApiKey1: process.env.GOOGLE_API_KEY_1,
    googleApiKey2: process.env.GOOGLE_API_KEY_2,
    googleApiKey3: process.env.GOOGLE_API_KEY_3,
    googleApiKey4: process.env.GOOGLE_API_KEY_4,
    googleApiKey5: process.env.GOOGLE_API_KEY_5,
    googleApiKey6: process.env.GOOGLE_API_KEY_6,
  }
})
