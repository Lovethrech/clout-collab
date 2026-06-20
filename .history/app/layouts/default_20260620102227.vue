<script setup>
const logoMarkWidth=ref("5vh");
const logoMarkHeight=ref("5vh");
const logoSvgWidth=ref("9vh");
const logoSvgHeight=ref("9vh");
const logoWordSize=ref("4vh");
</script>

<template>
    <div class="layout-default display-flex-justify-center-place-center">
        <AppLogo
            :logoMarkWidth="logoMarkWidth"
            :logoMarkHeight="logoMarkHeight"
            :logoSvgWidth="logoSvgWidth"
            :logoSvgHeight="logoSvgHeight"
            :logoWordSize="logoWordSize"
        />
        <slot></slot>
    </div>
</template>

<style scoped>
.layout-default{
    background-color: red;

}
</style>