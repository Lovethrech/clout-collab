<template>
    <span class="auth-question">
        Already jkj?
        <NuxtLink to="">
            <p class="auth-question-link">
                Login
            </p>
        </NuxtLink>
    </span>
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