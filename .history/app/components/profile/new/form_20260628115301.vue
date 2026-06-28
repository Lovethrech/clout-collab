<template>
    <div class="profile-new-form">
        <!-- profile-new-user-form -->
        <form class="profile-new-user-form">
            <div class="profile-new-user-form-img-ctn-bg">
                <div class="profile-new-user-form-img-ctn dsp-flex-jstf-center-plc-center">
                    <p class="profile-new-user-form-img-ctn-desc">
                        +<br/>Image Upload
                    </p>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.profile-new-user-form-img-ctn-bg{
    width: 100%;
    height: 20vh;
    background: var(--grad-signature);
    display: flex;
    justify-content: end;
    align-items: end;
}
.profile-new-user-form-img-ctn{
    width: 200px;
    height:200px;
    background-color: var(--slate-700);
    margin-bottom:-10vh;
    border-radius: 50%;
}
.profile-new-user-form-img-ctn-desc{
    text-align: center;
    font-family: var(--body-font);
    font-size:16px;
    font-wi
}
</style>