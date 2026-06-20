// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/supabase'
  ],
  supabase:{
    redirect: false
  },
  app:{
    head:{
      link:
    }
  }
  css: ['~/assets/css/main.css'],
  pwa: {
    manifest: {
      name: 'Clout Collabs',
      short_name: 'CloutCollabs',
      theme_color: '#6D28D9',
      background_color: '#0F172A',
      icons: []
    }
  }
})
