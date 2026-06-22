<script setup>
defineProps({
  type: {
    type: String,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="role-icon" :class="{ selected }">
    <svg v-if="type === 'creator'" viewBox="0 0 48 48">
      <rect
        x="4"
        y="14"
        width="40"
        height="26"
        rx="7"
        fill="none"
        :stroke="selected ? '#fff' : '#94A3B8'"
        stroke-width="3"
      />
      <circle
        cx="24"
        cy="27"
        r="8"
        fill="none"
        :stroke="selected ? '#fff' : '#94A3B8'"
        stroke-width="3"
      />
      <rect
        x="16"
        y="8"
        width="10"
        height="7"
        rx="2"
        :fill="selected ? '#fff' : '#94A3B8'"
      />
    </svg>

    <svg v-else-if="type === 'musician'" viewBox="0 0 48 48">
      <circle cx="14" cy="34" r="7" fill="none" stroke="#94A3B8" stroke-width="3" />
      <rect x="20" y="9" width="3" height="26" fill="#94A3B8" />
      <polygon points="23,9 23,19 33,14" fill="#94A3B8" />
    </svg>

    <svg v-else-if="type === 'brand'" viewBox="0 0 48 48">
      <rect x="6" y="18" width="36" height="22" rx="4" fill="none" stroke="#94A3B8" stroke-width="3" />
      <rect x="18" y="10" width="12" height="9" rx="3" fill="none" stroke="#94A3B8" stroke-width="3" />
      <line x1="6" y1="28" x2="42" y2="28" stroke="#94A3B8" stroke-width="2.5" />
    </svg>

    <svg v-else-if="type === 'creative-pro'" viewBox="0 0 48 48">
      <rect x="11" y="6" width="24" height="15" rx="4" fill="#94A3B8" opacity="0.45" />
      <rect x="8" y="14" width="26" height="15" rx="4" fill="#94A3B8" opacity="0.7" />
      <rect x="6" y="22" width="28" height="15" rx="4" fill="#94A3B8" />
    </svg>
  </div>
</template>

<style scoped>
.role-icon { 
  width: 38px; 
  height: 38px; 
  border-radius: 11px; 
  background: var(--slate-700); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0; 
}

.role-icon.selected { 
    background: var(--grad-signature); 
}

.role-icon svg { 
    width: 20px; 
    height: 20px; 
}
</style>