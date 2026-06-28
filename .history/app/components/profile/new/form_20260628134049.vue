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
            <div class="profile-new-user-form-input-and-label-field-and-portfolio-ctn">
                <div class="profile-new-user-form-input-and-label-field-ctn">
                    <div class="profile-new-user-form-input-and-label-field">
                        <label for="fullName" class="profile-new-user-form-label">Full Name:</label>
                        <input  type="text" id="fullName" class="profile-new-user-form-input" placeholder="John Doe"/>
                    </div>
                    <div class="profile-new-user-form-input-and-label-field">
                        <label for="bio" class="profile-new-user-form-label">Bio:</label>
                        <textarea type="text" id="bio" class="profile-new-user-form-input" placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, perferendis..."></textarea>
                    </div>
                    <div class="profile-new-user-form-input-and-label-field">
                        <label for="niche" class="profile-new-user-form-label">Niche:</label>
                        <select type="text" id="niche" class="profile-new-user-form-input profile-new-user-form-input-select">
                            <option value="0" class="profile-new-user-form-input-select-option">Short-form video</option>
                            <option value="1" class="profile-new-user-form-input-select-option">Long-form video</option>
                            <option value="2" class="profile-new-user-form-input-select-option">live streaming</option>
                            <option value="3" class="profile-new-user-form-input-select-option">Gaming</option>
                            <option value="4" class="profile-new-user-form-input-select-option">Lifestyle/vlog</option>
                            <option value="5" class="profile-new-user-form-input-select-option">comedy/skits</option>
                        </select>
                    </div>
                    <div class="profile-new-user-form-input-and-label-field">
                        <label for="niche" class="profile-new-user-form-label">Skills:</label>
                        <select type="text" id="niche" class="profile-new-user-form-input profile-new-user-form-input-select">
                            <option value="0" class="profile-new-user-form-input-select-option">Short-form video editing</option>
                            <option value="1" class="profile-new-user-form-input-select-option">Long-form video editing</option>
                            <option value="2" class="profile-new-user-form-input-select-option">scriptwriting</option>
                            <option value="3" class="profile-new-user-form-input-select-option">content strategy</option>
                            <option value="4" class="profile-new-user-form-input-select-option">music production</option>
                            <option value="5" class="profile-new-user-form-input-select-option">sound design</option>
                        </select>
                    </div>
                    <div class="profile-new-user-form-input-and-label-field">
                        <label for="bio" class="profile-new-user-form-label">Bio:</label>
                        <textarea type="text" id="bio" class="profile-new-user-form-input" placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, perferendis..."></textarea>
                    </div>
                </div>
                <hr/>
                <div class="profile-new-user-form-input-and-label-portfolio-ctn">
                    <div class="profile-new-user-form-input-and-label-portfolio-empty">

                    </div>
                    Portfolio section
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
.profile-new-user-form-input-and-label-field-and-portfolio-ctn{
    margin-top: 7vh;
    padding: 2vh 6vw;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 3vh;
}
.profile-new-user-form-input-and-label-field-ctn, .profile-new-user-form-input-and-label-portfolio-ctn{
    width: 50%;
}
.profile-new-user-form-input-and-label-field{
    display: flex;
    flex-direction: column;
    gap: 20px;    
}
.profile-new-user-form-label{
    font-family: var(--mono-font);
    color: var(--slate-200);
    font-weight: 500;
}
.profile-new-user-form-input-select{
    text-transform: capitalize;
}
.profile-new-user-form-input-select-option{
    text-transform: capitalize;
}

.profile-new-user-form-input-and-label-portfolio-ctn{

}

@media screen and (max-width: 990px) {
    .profile-new-user-form-input-and-label-field-and-portfolio-ctn{
        flex-direction: column;
    }
    .profile-new-user-form-input-and-label-field-ctn, .profile-new-user-form-input-and-label-portfolio-ctn{
        width: 100%;
    }
}
</style>