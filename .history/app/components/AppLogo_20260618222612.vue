<template>
    <div class="lockup">
        <div class="mark">
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
    margin-bottom:34px; }
.lockup .mark{ width:32px;height:32px;border-radius:9px;background:var(--grad); display:flex;align-items:center;justify-content:center; flex-shrink:0; }
.lockup .mark svg{ width:16px;height:16px; }
.lockup .word{ font-family:var(--display); font-weight:700; font-size:15px; }
</style>