import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    publicRuntimeConfig: {
        dataPath: process.env.DATA_PATH || '/data/',
        color: process.env.COLOR || 'yellow',
        title: process.env.TITLE || 'DrZoid\'s Http Directory Index'
    },
    css: [
        "~/assets/css/tailwind.css",
        '@fortawesome/fontawesome-free/css/all.min.css',
    ],
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
    }
})
