<script setup>
definePageMeta({})

const title = 'Clout Collabs | Authentication'
const description = ''

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
    twitterCard: 'summary_large_image'
})

const authTitle = ref('Create your account')
const authDesc = ref('Join creators, musicians, and brands building together.')
const btnText = ref('Create account')
const authQ = ref('Already have an account?')
const authQLinkDesc = ref('Log in')
const authQLink = ref('/login')

const currentStep = ref('signup')
const selectedRole = ref('creator')

function goToRoleStep() {
    currentStep.value = 'role'
}

function goToSignupStep() {
    currentStep.value = 'signup'
}

function handleRoleSelect(role) {
    selectedRole.value = role.id
    console.log('Selected role:', role)
}
</script>

<template>
    <div class="auth-page">
        <div
        v-if="currentStep === 'signup'"
        class="auth-page-main-ctn"
        >
        <AuthTitle :auth-title="authTitle" />

        <AuthDesc :auth-desc="authDesc" />

        <form class="auth-page-form" @submit.prevent="goToRoleStep">
            <AuthBtnGoogle />

            <div class="divider">
            <span class="line"></span>
            <span>or log in with email</span>
            <span class="line"></span>
            </div>

            <AuthFormEmailAndPassword />

            <BtnMainAuth
                :btn-text="btnText"
                :on-click="goToRoleStep"
            />
        </form>

        <br />

        <AuthQuestion
            :auth-q="authQ"
            :auth-q-link-desc="authQLinkDesc"
            :auth-q-link="authQLink"
        />

        <div class="fine-print">
            By continuing, you agree to the Terms<br />
            and Privacy Policy.
        </div>
        </div>

        <AuthRole
            v-if="currentStep === 'role'"
            v-model="selectedRole"
            :show-role-box="goToSignupStep"
            @select-role="handleRoleSelect"
        />
    </div>
</template>

<style scoped>
.auth-page-form {
    margin-top: 4vh;
}

.divider { 
    display: flex; 
    align-items: center; 
    gap: 2vh; 
    margin-bottom: 2vh; 
}

.divider .line { 
    flex: 1; 
    height: 0.1vh; 
    background: var(--slate-700); 
}

.divider span { 
    font-size: 1.4vh; 
    color: var(--slate-400); 
}

.fine-print {
    text-align: center; 
    font-size: 1.8vh; 
    color: var(--slate-600); 
    line-height: 1.5;
}
</style>