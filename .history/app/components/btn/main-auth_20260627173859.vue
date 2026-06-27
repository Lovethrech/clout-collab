<script setup>
const {btnText}=defineProps(["btnText"]);
</script>

<template>
    <div class="btn-main-auth" type="submit" :disabled="loading">
        <p class="btn-main-auth-text">
            {{ loading ? "Loading..." : btnText }}
        </p>
    </div>
</template>

<style scoped>
.btn-main-auth{
    background:var(--purple); 
    color:var(--slate-50); 
    text-align:center; 
    font-weight:700; 
    font-size:1.8vh; 
    border-radius:14px; 
    padding:1.6vh 0; 
    margin-bottom:2vh;
    transition: all 0.2s ease-in-out;
}
.btn-main-auth:hover{
    cursor: pointer;
    transform: scale(0.98);
}
</style>