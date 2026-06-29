<script setup>
definePageMeta({
    layout: false 
})

const title = 'Profile | Clout Collabs'
const description = ''
useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
    twitterCard: 'summary_large_image'
})
</script>

<template>
    <section class="profile-page">
        <ProfileHeader/>        
    </section>
</template>

<style scoped>

</style>
