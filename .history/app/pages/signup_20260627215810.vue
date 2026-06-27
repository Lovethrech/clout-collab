<script setup>
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
const supabase=useSupabaseClient();
const router=useRouter();

const form=ref({
    email: '',
    password: ''
});

const loading=ref(false);
const showRoleSelector=ref(false);
const pendingUserData=ref(null);
const step=ref("signup");

const handleNextStep=async()=>{
    loading.value=true;
    try{
        if(!form.value.email || !form.value.password){
            alert("Email and password are required");
            return;
        }
        pendingUserData.value= {...form.value};
        showRoleSelector.value=true;
        step.value="role";
    }
    catch(error){
        console.error("Error during signup:", error);
        alert("An error occurred during signup. Please try again.");
    }
    finally{
        loading.value=false;
    }
}

const finalizeSignUp=async(selectedRole)=>{
    loading.value=true;
    try{
        const {data, error}=await supabase.auth.signUp({
            email: pendingUserData.value.email,
            password: pendingUserData.value.password,
            options:{
                data:{
                    role: selectedRole
                }
            }
        });
        if(error){
            throw error;
        }
        alert("Sign up successful! Please check your email to confirm your account.");
        router.push("/login");
    }
    catch(error){
        console.error("Error during finalizing signup:", error);
        alert("An error occurred during finalizing signup. Please try again.");
    }
    finally{
        loading.value=false;
        showRoleSelector.value = false;
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-page-main-ctn" v-if="step === 'signup'">
            <AuthTitle :authTitle="'Create your account'"/>
            <AuthDesc :authDesc=" 'Join creators, musicians, and brands building together.'"/>
            <form @submit.prevent="handleNextStep" class="auth-page-form">
                <AuthBtnGoogle/>
                <div class="divider">
                    <span class="line"></span><span>or sign up with email</span><span class="line"></span>
                </div>
                <div class="form-email-and-password-ctn">
                    <input v-model="form.email" class="form-email-and-password" id="form-email" type="text" placeholder="Email address" required/>
                    <input v-model="form.password" class="form-email-and-password" id="form-password" type="password" placeholder="Password" required/>
                </div>
                <button class="btn-main-auth" :disabled="loading" @click="handleNextStep">
                    <p class="btn-main-auth-text">
                        {{ loading ? "Processing..." : "Create Account" }}
                    </p>
                </button>
            </form>
            <br/>
            <AuthQuestion :authQ="'Already have an account?'" :authQLinkDesc=" 'Log in' " :authQLink="'/login'"/>
            <div class="fine-print">
                By continuing, you agree to the Terms<br>and Privacy Policy.
            </div>
        </div>
        <AuthRole 
            v-if="showRoleSelector"
            :step="step"
            :pendingUserData="pendingUserData"
            @complete="finalizeSignUp"
        />
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