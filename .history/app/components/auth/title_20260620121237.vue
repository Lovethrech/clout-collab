<script setup>
const {authTitle}=defineProps([""])
</script>

<template>
    <h1 id="auth-title">
        {{authTitle}}
    </h1>
</template>

<style scoped>
#auth-title{
    font-family:var(--display-font); 
    font-weight:700; 
    font-size:4vh; 
    line-height:1.25;
    margin-bottom:2vh ;
}
</style>