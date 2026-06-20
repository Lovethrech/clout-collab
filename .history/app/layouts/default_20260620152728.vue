<script setup>
const logoMarkWidth=ref("4vh");
const logoMarkHeight=ref("4vh");
const logoSvgWidth=ref("8vh");
const logoSvgHeight=ref("8vh");
const logoWordSize=ref("2vh");
</script>

<template>
    <div class="layout-default dsp-flex-jstf-center-plc-center dsp-flex-flxd-column">
        <div class="layout-default-mini-ctn">
            <AppLogo
                :logoMarkWidth="logoMarkWidth"
                :logoMarkHeight="logoMarkHeight"
                :logoSvgWidth="logoSvgWidth"
                :logoSvgHeight="logoSvgHeight"
                :logoWordSize="logoWordSize"
            />
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.layout-default{
    min-height: 100vh;
}
.layout-default-mini-ctn{
    padding: 2vh;
    width: 40%;
}




@media screen and (max-width:950px) {
    .layout-default-mini-ctn{
        width: 100%;
    }
}
</style>