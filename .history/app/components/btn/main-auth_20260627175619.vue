<script setup>
const props = defineProps({
btnText: {
    type: String,
    required: true
},
loading: {
    type: Boolean,
    default: false
}
})
</script>

<template>
  <button 
    class="btn-main-auth" 
    type="submit" 
    :disabled="props.loading"
  >
    <span class="btn-main-auth-text">
      {{ props.loading ? "Processing..." : props.btnText }}
    </span>
  </button>
</template>

<style scoped>
.btn-main-auth {
  width: 100%;                    /* Always full width */
  background: var(--purple);
  color: var(--slate-50);
  font-weight: 700;
  font-size: 1.8vh;
  border-radius: 14px;
  padding: 1.6vh 0;
  margin-bottom: 2vh;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-main-auth:hover:not(:disabled) {
  transform: scale(0.98);
  filter: brightness(1.08);
}

.btn-main-auth:disabled {
  background: var(--slate-400);
  color: #e2e8f0;
  cursor: not-allowed;
  opacity: 0.75;
  transform: none !important;
}

/* Optional: better loading state */
.btn-main-auth:disabled .btn-main-auth-text {
  opacity: 0.9;
}
</style>