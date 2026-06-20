<script setup>
const {btnText}=defineProps(["btnText"]);
</script>

<template>
    <div class="btn-main-auth">
        <p class="btn-main-auth-text">
            {{btnText}}
        </p>
    </div>
</template>

<style scoped>
.btn-main-auth{
    background:var(--grad-signature); 
    color:var(--slate-50); 
    text-align:center; 
    font-weight:700; 
    font-size:1.6vh; 
    border-radius: 14px; 
    padding:2vh 0; 
    margin-bottom:2vh; 
    box-shadow:0 14px 28px -14px rgba(109,40,217,0.6);
    transition: transform .4s;
}
.btn-main-auth:hover{
    cursor: pointer;
    transform: scale(0.98);
}
</style>