<script setup>
const {showRoleBox}=defineProps(['showRoleBox']);

const emit = defineEmits(['complete', 'cancel']);

const selectedRole = ref(null);
// ✓

const roles = [
    { value: 'creator', emoji: '🎥', label: 'Creator', desc: 'Content, video, photo & more' },
    { value: 'musician', emoji: '🎤', label: 'Musician', desc: 'Artists, producers, DJs' },
    { value: 'brand', emoji: '🏢', label: 'Brand', desc: 'Companies & campaigns' },
    { value: 'creative_professional', emoji: '🎨', label: 'Creative Professional', desc: 'Editors, designers, etc.' }
]

const complete = () => {
    if (selectedRole.value) {
        emit('complete', selectedRole.value)
    }
}
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

            <div class="role-list" v-for="role in roles" :key="role.value" @click="selectedRole = role.value">
                <div class="role-card selected" :class="[selectedRole === role.value ? 'border-purple-500 bg-purple-500/10' 
              : 'border-white/10 hover:border-white/30']">
                    <div class="role-icon dsp-flex-jstf-center-plc-center">{{role.emoji}}</div>
                    <div class="role-text">
                        <div class="t">{{role.label}}</div>
                        <div class="d">{{role.desc}}</div>
                    </div>
                    <div class="role-check dsp-flex-jstf-center-plc-center">✓</div>
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