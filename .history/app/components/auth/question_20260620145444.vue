<script setup>
const {authQ}=defineProps(['authQ']);
</script>

<template>
    <div class="auth-question" v-html="authQ"></div>
    
</template>

<style scoped>
.auth-question{
    text-align:center; 
    font-size:1em; 
    color:var(--slate-400); 
    margin-top:auto;
}
.auth-question .auth-question-link{
    color:var(--pink-300); 
    font-weight:600;
}
</style>