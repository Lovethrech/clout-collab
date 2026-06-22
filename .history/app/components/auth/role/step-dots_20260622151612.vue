<script setup>
defineProps({
  total: {
    type: Number,
    default: 2
  },
  activeIndex: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div class="steps">
    <div
      v-for="index in total"
      :key="index"
      class="dot"
      :class="{ active: index - 1 === activeIndex }"
    />
  </div>
</template>

<style scoped>
.steps { 
  display: flex; 
  gap: 1.2em; 
}

.dot { 
    width: 18px; 
    height: 5px; 
    border-radius: 3px; 
    background: var(--slate-700); 
}

.dot.active { 
    background: var(--grad-signature); 
}
</style>