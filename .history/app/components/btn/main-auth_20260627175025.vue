<script setup>
const {btnText, loading}=defineProps(["btnText", "loading"]);
</script>

<template>
    <button class="btn-main-auth" type="submit" :disabled="loading">
        <p class="btn-main-auth-text">
            {{ loading ? "Processing..." : btnText }}
        </p>
    </button>
</template>

<style scoped>

.btn-main-auth:hover{
    cursor: pointer;
    transform: scale(0.98);
}
.btn-main-auth:disabled{
    width: 100%;
    background:var(--slate-400);
    cursor: not-allowed;
}
</style>