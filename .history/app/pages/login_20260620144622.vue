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
const authDesc=ref("Log in to keep the conversation going.");
const btnText=ref("Login");
const authQ=ref("Already jkj?<NuxtLink to'><span class='auth-question-link'>Login</span></NuxtLink>")
</script>

<template>
    <div class="auth-page">
        <AuthTitle :authTitle="authTitle"/>
        <AuthDesc :authDesc="authDesc"/>
        <form class="auth-page-form">
            <AuthBtnGoogle/>
            <div class="divider">
                <span class="line"></span><span>or log in with email</span><span class="line"></span>
            </div>
            <AuthFormEmailAndPassword/>
            <BtnMainAuth :btnText="btnText"/> 
        </form>
        <AuthQuestion/>
    </div>
</template>

<style scoped>
.auth-page-form{
    margin-top: 4vh;
}
.divider{ 
    display:flex; 
    align-items:center; 
    gap:2vh; 
    margin-bottom:2vh; 
}
.divider .line{ 
    flex:1; 
    height:0.1vh; 
    background:var(--slate-700); 
}
.divider span{ 
    font-size:1.4vh; 
    color:var(--slate-400); 
}
</style>