<script setup>
const btnText=ref("Create Account")
</script>

<template>
    <NuxtLink to="/login">

    </NuxtLink>
    <BtnPry :btnText="btnText"/>
</template>