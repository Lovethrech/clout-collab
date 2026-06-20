<script setup>
const title = 'Clout Collabs | Authentication'
const description = ''

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
    twitterCard: 'summary_large_image'
})
const authTitle=ref("Welcome back");
const authDesc=ref("Log in to keep the conversation going.")
</script>

<template>
    <div class="auth-login-page">
        <AuthTitle :authTitle="authTitle"/>
        <AuthDesc :authDesc="authDesc"/>
        <form class="auth-login-page-form">
            
        </form>
    </div>
</template>