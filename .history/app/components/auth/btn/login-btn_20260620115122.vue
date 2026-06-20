<script setup>
const btnText=ref("Login")
</script>

<template>
    <NuxtLink to="/login">

    </NuxtLink>
    <BtnSec :btnText="btnText"/>
</template>