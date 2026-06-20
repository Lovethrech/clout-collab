<script setup>
const {authDesc}=defineProps(["authDesc"]);
</script>

<template>
    <h1 id="auth-desc">
        {{authDesc}}
    </h1>
</template>

<style scoped>
#index-app-desc{
    font-size:2vh; 
    color:var(--slate-400); 
    line-height:1.55; 
}
</style>