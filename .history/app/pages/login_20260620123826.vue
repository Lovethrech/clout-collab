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
            <AuthBtnGoogle/>
            <div class="divider">
                <span class="line"></span><span>or log in with email</span><span class="line"></span>
            </div>
        </form>
    </div>
</template>

<style scoped>
.auth-login-page-form{
    margin-top: 4vh;
}
.divider{ display:flex; align-items:center; gap:10px; margin-bottom:18px; }
.divider .line{ flex:1; height:1px; background:var(--slate-700); }
.divider span{ font-size:11px; color:var(--slate-400); }
</style>