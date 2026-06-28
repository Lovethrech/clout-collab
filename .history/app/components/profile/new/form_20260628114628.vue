<template>
    <div class="profile-new-form">
        <!-- profile-new-user-form -->
        <form class="profile-new-user-form">
            <div class="profile-new-user-form-img-ctn-bg">
                <div class="profile-new-user-form-img-ctn">
                    <p class="profile-new-user-form-img-ctn-desc">
                        +
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
    background-color: red;
    margin-bottom:-10vh;
    border-radius: 50%;
}
</style>