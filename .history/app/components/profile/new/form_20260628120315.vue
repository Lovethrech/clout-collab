<template>
    <div class="profile-new-form">
        <!-- profile-new-user-form -->
        <form class="profile-new-user-form">
            <div class="profile-new-user-form-img-ctn-bg">
                <div class="profile-new-user-form-img-ctn dsp-flex-jstf-center-plc-center">
                    <div class="profile-new-user-form-img-ctn-empty">
                        <p class="profile-new-user-form-img-ctn-desc-sign">
                            +
                        </p>
                        <p class="profile-new-user-form-img-ctn-desc">
                            Image Upload
                        </p>
                    </div>
                    
                </div>
            </div>

            <div class="profile-new-user-form-input-and-label-field-ctn">
                <label for="fullName" class="profile-new-user-form-label">Full Name:</label>
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
    cursor: pointer;
    transition: transform .2s ease-in-out;
}
.profile-new-user-form-img-ctn:hover{
    transform: scale(0.98);
}
.profile-new-user-form-img-ctn-empty{
    text-align: center;
    font-family: var(--body-font);
    font-size:16px;
    font-weight: 700;
}
.profile-new-user-form-img-ctn-desc-sign{
    font-size:36px;
}

.profile-new-user-form-input-and-label-field-ctn{
    margin-top: 8vh;
    padding: 2vh 4vh;
}
</style>