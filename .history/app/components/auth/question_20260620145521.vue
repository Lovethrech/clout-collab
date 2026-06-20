<script setup>
const {authQ}=defineProps(['authQ']);
</script>

<template>
    <div class="auth-question" v-html="authQ"></div>
    New to Clout Collabs?<NuxtLink to=''><span class='auth-question-link'>Create an account</span></NuxtLink>
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