<script setup>
const {showRoleBox}=defineProps(['showRoleBox']);

const selectedCardTheme=ref()

const creatorSelectTheme=ref({
    borderCollor: "var(--purple-500)",
    iconColor: "",
    iconBg: "var(--grad-signature)",
    listBg: "background:rgba(109,40,217,0.14)",
    listBoxShadow: "box-shadow:0 0 0 3px rgba(139,92,246,0.18)"
})
</script>

<template>
    <div class="auth-role dsp-flex-jstf-center-plc-center">
        <div class="auth-role-main-ctn">
            <div class="topnav dsp-flex-jstf-center-plc-spcbtw">
                <div class="back dsp-flex-jstf-center-plc-center" @click="showRoleBox">‹</div>
                <div class="steps"><div class="dot"></div><div class="dot active"></div></div>
                <div style="width:30px;"></div>
            </div>

            <div class="scr-h1" >What brings you here?</div>
            <div class="scr-sub">Pick what fits best, you can add more later.</div>

            <div class="role-list">
                <div class="role-card selected">
                    <div class="role-icon dsp-flex-jstf-center-plc-center"><svg viewBox="0 0 48 48"><rect x="4" y="14" width="40" height="26" rx="7" fill="none" stroke="#fff" stroke-width="3"/> <circle cx="24" cy="27" r="8" fill="none" stroke="#fff" stroke-width="3"/> <rect x="16" y="8" width="10" height="7" rx="2" fill="#fff"/></svg></div>
                    <div class="role-text"><div class="t">Creator</div><div class="d">Content, video, photo & more</div></div>
                    <div class="role-check dsp-flex-jstf-center-plc-center">✓</div>
                </div>
                <div class="role-card">
                    <div class="role-icon dsp-flex-jstf-center-plc-center"><svg viewBox="0 0 48 48"><circle cx="14" cy="34" r="7" fill="none" stroke="#94A3B8" stroke-width="3"/><rect x="20" y="9" width="3" height="26" fill="#94A3B8"/><polygon points="23,9 23,19 33,14" fill="#94A3B8"/></svg></div>
                    <div class="role-text"><div class="t">Musician</div><div class="d">Singers, producers, DJs & more</div></div>
                    <div class="role-check empty dsp-flex-jstf-center-plc-center"></div>
                </div>
                <div class="role-card">
                    <div class="role-icon dsp-flex-jstf-center-plc-center"><svg viewBox="0 0 48 48"><rect x="6" y="18" width="36" height="22" rx="4" fill="none" stroke="#94A3B8" stroke-width="3"/><rect x="18" y="10" width="12" height="9" rx="3" fill="none" stroke="#94A3B8" stroke-width="3"/><line x1="6" y1="28" x2="42" y2="28" stroke="#94A3B8" stroke-width="2.5"/></svg></div>
                    <div class="role-text"><div class="t">Brand</div><div class="d">Hiring creators for campaigns</div></div>
                    <div class="role-check empty dsp-flex-jstf-center-plc-center"></div>
                </div>
                <div class="role-card">
                    <div class="role-icon dsp-flex-jstf-center-plc-center"><svg viewBox="0 0 48 48"><rect x="11" y="6" width="24" height="15" rx="4" fill="#94A3B8" opacity="0.45"/><rect x="8" y="14" width="26" height="15" rx="4" fill="#94A3B8" opacity="0.7"/><rect x="6" y="22" width="28" height="15" rx="4" fill="#94A3B8"/></svg></div>
                    <div class="role-text"><div class="t">Creative Pro</div><div class="d">Editors, designers, animators</div></div>
                    <div class="role-check empty dsp-flex-jstf-center-plc-center"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-role{
    width: 100%;
    min-height: 100vh;
    background: var(--slate-900); 
    position: absolute;
    top: 0;
    left:0;
}
.auth-role-main-ctn{
    padding: 2vh;
    width: 40%;
    margin-top: 14vh;
}
.topnav{ 
    padding:2vh 0 1vh; 
}
.back{ 
    width:3vh; 
    height:3vh; 
    border-radius:50%; 
    background:var(--slate-800); 
    font-size:3vh; 
    color:var(--slate-400); 
    cursor: pointer;
}
.steps{ 
    display:flex; 
    gap: 1.2em; 
}
.steps .dot{ 
    width:18px; 
    height:5px; 
    border-radius:3px; 
    background:var(--slate-700); 
}
.steps .dot.active{ 
    background:var(--grad-signature); 
}
.scr-h1{ 
    font-family:var(--display-font); 
    font-weight:700; 
    font-size: 3.6vh; 
    line-height:1.2; 
    margin-bottom:1vh; 
}
.scr-sub{ 
    font-size:2vh; 
    color:var(--slate-400); 
    line-height:1.5; 
    margin-bottom:24px; 
}
.role-list{ 
    display:flex; 
    flex-direction:column; 
    gap: 3vh; 
    margin-bottom:18px; 
}
.role-card{ 
    display:flex; 
    align-items:center; 
    gap:13px; 
    border:1.5px solid var(--slate-700); 
    border-radius:16px; 
    padding:13px 14px; 
    background:var(--slate-800); 
}
.role-card.selected{ 
    border-color:var(--purple-500); 
    background:rgba(109,40,217,0.14); 
    box-shadow:0 0 0 3px rgba(139,92,246,0.18); 
}
.role-icon{ 
    width:38px; 
    height:38px; 
    border-radius:11px; 
    background:var(--slate-700); 
    flex-shrink:0; 
}
.role-card.selected .role-icon{ 
    background:var(--grad-signature); 
}
.role-icon svg{ 
    width:20px; 
    height:20px; 
}
.role-text .t{ 
    font-weight:700; 
    font-size: 2vh; 
    margin-bottom:2px; 
}
.role-text .d{ 
    font-size: 1.4vh; 
    color:var(--slate-400); 
    line-height:1.3; 
}
.role-check{ 
    margin-left:auto; 
    width:20px; 
    height:20px; 
    border-radius:50%; 
    background:var(--grad-signature); 
    color:#fff; 
    font-size:11px; 
    flex-shrink:0; }
.role-check.empty{ 
    background:transparent; 
    border:1.5px solid var(--slate-600); 
}

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