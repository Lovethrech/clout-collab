<script setup>const title = 'Clout Collabs | Authentication'
const description = ''

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
    twitterCard: 'summary_large_image'
})
const supabase=useSupabaseClient();
const router=useRouter()
const authTitle=ref("Welcome back");
const authDesc=ref("Log in to keep the conversation going.");
const loading=ref(false);
const btnText=ref("Login");
const authQ=ref("New to Clout Collabs?");
const authQLinkDesc=ref("Create an account");
const authQLink=ref("/signup");
</script>

<template>
    <div class="auth-page">
        <AuthTitle :authTitle="authTitle"/>
        <AuthDesc :authDesc="authDesc"/>
        <form class="auth-page-form">
            <AuthBtnGoogle/>
            <div class="divider">
                <span class="line"></span><span>or log in with email</span><span class="line"></span>
            </div>
            <AuthFormEmailAndPassword/>
            <BtnMainAuth :btnText="btnText" :loading="loading"> </BtnMainAuth>
        </form>
        <br/>
        <AuthQuestion :authQ="authQ" :authQLinkDesc="authQLinkDesc" :authQLink="authQLink"/>
        <div class="fine-print">
            By continuing, you agree to the Terms<br>and Privacy Policy.
        </div>
    </div>
</template>

<style scoped>
.auth-page-form{
    margin-top: 4vh;
}
.divider{ 
    display:flex; 
    align-items:center; 
    gap:2vh; 
    margin-bottom:2vh; 
}
.divider .line{ 
    flex:1; 
    height:0.1vh; 
    background:var(--slate-700); 
}
.divider span{ 
    font-size:1.4vh; 
    color:var(--slate-400); 
}
.fine-print{
    text-align:center; 
    font-size:1.8vh; 
    color:var(--slate-600); 
    line-height:1.5;
}
</style>