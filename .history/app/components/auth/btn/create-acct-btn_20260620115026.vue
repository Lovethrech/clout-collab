<script setup>
const btnText=ref("Create Account")
</script>

<template>
    <NuxtLink to="/sign">

    </NuxtLink>
    <BtnPry :btnText="btnText"/>
</template>