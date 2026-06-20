<script setup>
const btnText=ref("Create Account")
</script>

<template>
    <NuxtLink to="/signup">

    </NuxtLink>
    <BtnPry :btnText="btnText"/>
</template>