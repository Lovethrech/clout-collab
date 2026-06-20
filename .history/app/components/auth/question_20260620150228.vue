<script setup>
const {authQ, authQLink, authQLinkDesc}=defineProps(['authQ', 'authQLink', 'authQLinkDesc']);
</script>

<template>
    <div class="auth-question-ctn">
        
    </div>
    <span class="auth-question">
        {{ authQ }}
    </span>
    <NuxtLink :to='authQLink'> 
        <span class='auth-question-link'>
            {{ authQLinkDesc }}
        </span>
    </NuxtLink>
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