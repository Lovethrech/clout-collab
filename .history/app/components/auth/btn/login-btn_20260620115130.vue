<script setup>
const btnText=ref("Login")
</script>

<template>
    <NuxtLink to="/login">
        <BtnSec :btnText="btnText"/>
    </NuxtLink>
</template>