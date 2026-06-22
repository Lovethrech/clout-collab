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

            <div class="role-list">
                <div class="role-card selected">
                    <div class="role-icon">
                        <svg viewBox="0 0 48 48">
                            <rect x="4" y="14" width="40" height="26" rx="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="27" r="8" fill="none" stroke="#fff" stroke-width="3"/>
                            <rect x="16" y="8" width="10" height="7" rx="2" fill="#fff"/>
                        </svg>
                    </div>
                    <div class="role-text"><div class="t">Creator</div><div class="d">Content, video, photo & more</div></div>
                    <div class="role-check">✓</div>
                </div>
                <div class="role-card">
                    <div class="role-icon">
                        <svg viewBox="0 0 48 48">
                            <circle cx="14" cy="34" r="7" fill="none" stroke="#94A3B8" stroke-width="3"/><rect x="20" y="9" width="3" height="26" fill="#94A3B8"/>
                            <polygon points="23,9 23,19 33,14" fill="#94A3B8"/>
                        </svg>
                    </div>
                    <div class="role-text"><div class="t">Musician</div><div class="d">Singers, producers, DJs & more</div></div>
                    <div class="role-check empty"></div>
                </div>
                <div class="role-card">
                    <div class="role-icon">
                        <svg viewBox="0 0 48 48">
                            <rect x="6" y="18" width="36" height="22" rx="4" fill="none" stroke="#94A3B8" stroke-width="3"/>
                            <rect x="18" y="10" width="12" height="9" rx="3" fill="none" stroke="#94A3B8" stroke-width="3"/><line x1="6" y1="28" x2="42" y2="28" stroke="#94A3B8" stroke-width="2.5"/></svg></div>
                    <div class="role-text"><div class="t">Brand</div><div class="d">Hiring creators for campaigns</div></div>
                    <div class="role-check empty"></div>
                </div>
                <div class="role-card">
                    <div class="role-icon"><svg viewBox="0 0 48 48"><rect x="11" y="6" width="24" height="15" rx="4" fill="#94A3B8" opacity="0.45"/><rect x="8" y="14" width="26" height="15" rx="4" fill="#94A3B8" opacity="0.7"/><rect x="6" y="22" width="28" height="15" rx="4" fill="#94A3B8"/></svg></div>
                    <div class="role-text"><div class="t">Creative Pro</div><div class="d">Editors, designers, animators</div></div>
                    <div class="role-check empty"></div>
                </div>
            </div>
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
    padding:2vh 0 1vh; 
}
.back{ 
    width:30px; 
    height:30px; 
    border-radius:50%; 
    background:var(--slate-800); 
    font-size:2vh; 
    color:var(--slate-400); 
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
    font-size:22px; 
    line-height:1.2; 
    margin-bottom:8px; 
}
.scr-sub{ 
    font-size:13px; 
    color:var(--slate-400); 
    line-height:1.5; 
    margin-bottom:24px; 
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