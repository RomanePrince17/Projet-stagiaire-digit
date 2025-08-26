// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      baseURL: 'digit-cursus-backend.onrender.com' // ✅ change ceci selon ton besoin
    }
  }
})
