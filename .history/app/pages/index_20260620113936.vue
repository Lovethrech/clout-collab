import { AuthBtnCreateAcctBtn, AuthBtnLoginBtn } from '../../.nuxt/components';
<template>
    <main class="index-app">
        <h1 id="index-app-title">
            Find. Connect. Collaborate.
        </h1>
        <p id="index-app-desc">
            Creators, musicians, and brands building together — locally and globally.
        </p>
        <div class="index-app-auth-option">
            <AuthBtnCreateAcctBtn/>
            <AuthBtnLoginBtn/>
            <div class="fine-print">
                By continuing, you agree to the Terms<br>and Privacy Policy.
            </div>
        </div>
    </main>
</template>

<style scoped>
.index-app{
    margin: 2vh;
}
#index-app-title{
    font-family:var(--display-font); 
    font-weight:700; 
    font-size:4vh; 
    line-height:1.25;
    margin-bottom:2vh ;
}
#index-app-desc{
    font-size:2vh; 
    color:var(--slate-400); 
    line-height:1.55; 
}
.index-app-auth-option{
    margin-top: 3vh;
}
.fine-print{
    text-align:center; 
    font-size:1.2vh; 
    color:var(--slate-600); 
    line-height:1.5;
}
</style>