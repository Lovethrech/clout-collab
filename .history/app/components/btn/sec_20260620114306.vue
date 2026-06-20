<script setup>
const {btnText}=defineProps(["btnText"]);
</script>


<template>
    <div class="btn-sec">
        <p class="btn-sec-text">
            {{btnText}}
        </p>
    </div>
</template>

<style scoped>
.btn-sec{
    background:transparent; 
    color:var(--slate-50); 
    text-align:center; 
    font-weight:600; 
    font-size:1.6vh; 
    border-radius:14px; 
    padding:2vh 0; 
    border:0.2vh solid var(--slate-700); 
    margin-bottom:2vh;
}
.btn-pry:hover{
    cursor: pointer;
    transform: scale(0.98);
}
</style>