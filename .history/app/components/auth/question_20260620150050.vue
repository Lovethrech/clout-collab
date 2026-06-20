<script setup>
const {authQ, authQLink, authQLinkDesc}=defineProps(['authQ', 'authQLink']);
</script>

<template>
    <span class="auth-question" v-html="authQ"></span>
    <NuxtLink to=''><span class='auth-question-link' v-html="authQLink"></span></NuxtLink>
</template>

<style scoped>
.auth-question{
    text-align:center; 
    font-size:1em; 
    color:var(--slate-400); 
    margin-top:auto;
}
.auth-question-link{
    color:var(--pink-300); 
    font-weight:600;
}
</style>