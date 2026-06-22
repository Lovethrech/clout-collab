<template>
    <div class="auth-role dsp-flex-jstf-center-plc-center">
        <div class="auth-role-main-ctn">
            <div class="topnav dsp-flex-jstf-center-plc-spcbtw">
                <div class="back dsp-flex-jstf-center-plc-center">‹</div>
                <div class="steps"><div class="dot"></div><div class="dot active"></div></div>
                <div style="width:30px;"></div>
            </div>

            <div class="scr-h1" >What brings you here?</div>
            <div class="scr-sub">Pick what fits best, you can add more later.</div>
        </div>
    </div>
</template>

<style scoped>
.auth-role{
    width: 100%;
    height: 100vh;
    background: var(--slate-900); 
    position: absolute;
    top: 0;
    left:0;
}
.auth-role-main-ctn{
    padding: 2vh;
    width: 40%;
}
.topnav{ 
    padding:34px 0 0; 
}
.back{ 
    width:30px; 
    height:30px; 
    border-radius:50%; 
    background:var(--slate-800); 
    font-size:14px; 
    color:var(--slate-400); 
}
.steps{ display:flex; gap:6px; }
.steps .dot{ width:18px; height:5px; border-radius:3px; background:var(--slate-700); }
.steps .dot.active{ background:var(--grad-signature); }
.scr-h1{ font-family:var(--display-font); font-weight:700; font-size:22px; line-height:1.2; margin-bottom:8px; }
.scr-sub{ font-size:13px; color:var(--slate-400); line-height:1.5; margin-bottom:24px; }

@media screen and (max-width:1050px) and (min-width:951px) {
    .auth-role-main-ctn{
        width: 60%;
    }
}

@media screen and (max-width:950px) {
    .auth-role-main-ctn{
        width: 100%;
    }
}
</style>