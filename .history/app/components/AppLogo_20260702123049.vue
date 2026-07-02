<script setup>
const {logoMarkWidth, logoMarkHeight, logoSvgWidth, logoSvgHeight, logoWordSize}=defineProps(['logoMarkWidth', 'logoMarkHeight', 'logoSvgWidth', 'logoSvgHeight', 'logoWordSize']);
</script>

<template>
    <div class="lockup">
        <div class="mark" :style="{width:logoMarkWidth, height:logoMarkHeight}">
            <svg viewBox="0 0 200 200" :style="{width:logoSvgWidth, height:logoSvgHeight}">
                <polygon points="120,38 76,108 99,108 87,164 142,94 113,94" fill="#fff"/>
            </svg>
        </div>
        <div class="word" :style="{fontSize:logoWordSize}">Clout Collabs</div>
    </div>
</template>
<style>
.lockup{ 
    display:flex; 
    align-items:center; 
    gap:10px; 
    margin: auto 0;
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