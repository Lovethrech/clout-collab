<script setup>
const btnText=ref("Create Account")
</script>

<template>
    <NuxtLink to="/signup">
        <BtnPry :btnText="btnText"/>
    </NuxtLink>
</template>