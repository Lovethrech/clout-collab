<script setup>
definePageMeta
</script>

<template>
    <div class="auth-role">
        <div class="topnav">
            <div class="back dsp-flex-jstf-center-plc-center">‹</div>
            <div class="steps"><div class="dot"></div><div class="dot active"></div></div>
            <div style="width:30px;"></div>
        </div>

        <div class="scr-h1" >What brings you here?</div>
        <div class="scr-sub">Pick what fits best, you can add more later.</div>

    </div>
</template>

<style scoped>
.topnav{ 
    display:flex; 
    align-items:center; 
    justify-content:space-between; 
    padding:14px 0 0; 
}
.back{ 
    width:30px; 
    height:30px; 
    border-radius:50%; 
    background:var(--slate-800); 
    font-size:14px; 
    color:var(--slate-400); 
}

.scr-h1{ font-family:var(--display-font); font-weight:700; font-size:22px; line-height:1.2; margin-bottom:8px; }
      .scr-sub{ font-size:13px; color:var(--slate-400); line-height:1.5; margin-bottom:24px; }
</style>