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
      .btn-primary{ background:var(--purple); color:var(--slate-50); text-align:center; font-weight:700; font-size:14px; border-radius:14px; padding:15px 0; margin-bottom:20px; }
      .btn-primary.gradient{ background:var(--grad-signature); }

.btn-main-auth{

}
.btn-main-auth:hover{
    cursor: pointer;
    transform: scale(0.98);
}
</style>