<template>
    <div class="btn-google">
        <span class="g">G</span>
        Continue with Google
    </div>
</template>

<style scoped>
.btn-google{ 
    display:flex; 
    align-items:center; 
    justify-content:center; 
    gap:10px; 
    background:var(--slate-50); 
    color:var(--slate-900); 
    font-weight:600; 
    font-size:13.5px; 
    border-radius:14px; 
    padding:13px 0; 
    margin-bottom:18px; 
}
.btn-google .g{ 
    width:18px; 
    height:18px; 
    border-radius:50%; 
    background:#fff; 
    border:1.5px solid var(--slate-400);
    display:flex; align-items:center; 
    justify-content:center; font-family:var(--display-font); font-size:11px; font-weight:700; color:var(--blue); }

</style>