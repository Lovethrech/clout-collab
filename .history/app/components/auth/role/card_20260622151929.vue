<script setup>
import RoleIcon from '~/components/atoms/RoleIcon.vue'
import RoleCheck from '~/components/atoms/RoleCheck.vue'

defineProps({
  role: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="role-card"
    :class="{ selected }"
    @click="$emit('select', role)"
  >
    <RoleIcon
      :type="role.icon"
      :selected="selected"
    />

    <div class="role-text">
      <div class="t">{{ role.title }}</div>
      <div class="d">{{ role.description }}</div>
    </div>

    <RoleCheck :selected="selected" />
  </button>
</template>

<style scoped>
.role-card { 
  display: flex; 
  align-items: center; 
  gap: 13px; 
  border: 1.5px solid var(--slate-700); 
  border-radius: 16px; 
  padding: 13px 14px; 
  background: var(--slate-800); 
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.role-card.selected { 
  border-color: var(--purple-500); 
  background: rgba(109, 40, 217, 0.14); 
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18); 
}

.role-text .t { 
    font-weight: 700; 
    font-size: 2vh; 
    margin-bottom: 2px; 
}

.role-text .d { 
    font-size: 11px; 
    color: var(--slate-400); 
    line-height: 1.3; 
}
</style>