<script setup>
defineProps({
  onClick: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <button
    type="button"
    class="back dsp-flex-jstf-center-plc-center"
    @click="onClick"
  >
    ‹
  </button>
</template>

<style scoped>
.back { 
    width: 3vh; 
    height: 3vh; 
    border-radius: 50%; 
    background: var(--slate-800); 
    font-size: 3vh; 
    color: var(--slate-400); 
    border: none;
    cursor: pointer;
}
</style>