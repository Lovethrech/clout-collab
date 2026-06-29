<template>
    <div class="profile-header-ctn">
        <div class="profile-header-ctn-nav dsp-flex-jstf-center-plc-spcbtw">
            <ProfileHeaderHomeBtn/>
            <ProfileHeaderSettings/>
        </div>
    </div>
</template>

<style scoped>
.profile-header-ctn{
    width: 100%;
    height: 20vh;
    background: var(--grad-signature);    
}
.profile-header-ctn-nav{
    padding: 2vh 4vw;
}
</style>