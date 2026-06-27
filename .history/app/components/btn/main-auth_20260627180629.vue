<script setup>
const props = defineProps({
  btnText: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
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
  text-align: center;
  font-weight: 700;
  font-size: 1.8vh;
  border-radius: 14px;
  padding: 1.6vh 0;
  margin-bottom: 2vh;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover - only when NOT disabled */
.btn-main-auth:hover:not(:disabled) {
  transform: scale(0.98);
  filter: brightness(1.05);
}

/* ==================== DISABLED STATE ==================== */
.btn-main-auth:disabled {
  background: var(--slate-400) !important;
  color: #cbd5e1 !important;
  cursor: not-allowed !important;
  opacity: 0.75;
  transform: none !important;           /* Prevent hover scale */
}

/* Optional: extra visual feedback for loading/disabled */
.btn-main-auth:disabled .btn-main-auth-text {
  opacity: 0.85;
}
</style>