<script setup>
const {logoMarkWidth, logoMarkHeight, logoSvgWidth, logoSvgHeight, logoWordSize}=defineProps(['logoMarkWidth', 'logoMarkHeight', 'logoSvgWidth', 'logoSvgHeight', ''])
</script>

<template>
    <div class="lockup">
        <div class="mark" >
            <svg viewBox="0 0 200 200">
                <polygon points="120,38 76,108 99,108 87,164 142,94 113,94" fill="#fff"/>
            </svg>
        </div>
        <div class="word">Clout Collabs</div>
    </div>
</template>
<style>
.lockup{ 
    display:flex; 
    align-items:center; 
    gap:10px; 
    margin-bottom:34px; 
}
.lockup .mark{ 
    border-radius:9px;
    background:var(--grad-signature); 
    display:flex;
    align-items:center;
    justify-content:center; 
    flex-shrink:0; 
}
.lockup .word{ 
    font-family:var(--display-font); 
    font-weight:700; 
}
</style>