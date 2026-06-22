<script setup>
import { ref } from 'vue'
import {
  Camera,
  Music2,
  Building2,
  Palette,
  ChevronLeft,
  Check,
  Loader2
} from 'lucide-vue-next'

const props = defineProps({
  showRoleBox: {
    type: Function,
    required: true
  },

  onComplete: {
    type: Function,
    default: async (roleId) => {
      console.log('Selected role:', roleId)
    }
  }
})

const emit = defineEmits(['select-role', 'complete'])

const roles = [
  {
    id: 'creator',
    label: 'Creator',
    description: 'Content, video, photo & more',
    icon: Camera
  },
  {
    id: 'musician',
    label: 'Musician',
    description: 'Singers, producers, DJs & more',
    icon: Music2
  },
  {
    id: 'brand',
    label: 'Brand',
    description: 'Hiring creators for campaigns',
    icon: Building2
  },
  {
    id: 'creative_professional',
    label: 'Creative Pro',
    description: 'Editors, designers, animators',
    icon: Palette
  }
]

const selectedRole = ref(null)
const isSaving = ref(false)
const error = ref(null)

function handleSelect(roleId) {
  selectedRole.value = roleId
  error.value = null

  emit('select-role', roleId)
}

function handleKeyDown(event, roleId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSelect(roleId)
  }
}

async function handleContinue() {
  if (!selectedRole.value || isSaving.value) return

  isSaving.value = true
  error.value = null

  try {
    await props.onComplete(selectedRole.value)
    emit('complete', selectedRole.value)
  } catch (err) {
    error.value = "Couldn't save your role. Try again."
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="auth-role dsp-flex-jstf-center-plc-center">
    <div class="auth-role-main-ctn">
      <div class="topnav dsp-flex-jstf-center-plc-spcbtw">
        <button
          type="button"
          class="back dsp-flex-jstf-center-plc-center"
          aria-label="Go back"
          @click="showRoleBox"
        >
          <ChevronLeft :size="18" />
        </button>

        <div class="steps">
          <div class="dot"></div>
          <div class="dot active"></div>
        </div>

        <div style="width:30px;"></div>
      </div>

      <div class="scr-h1">What brings you here?</div>

      <div class="scr-sub">
        Pick what fits best — you can add more later.
      </div>

      <div
        class="role-list"
        role="radiogroup"
        aria-label="Select your role"
      >
        <div
          v-for="(role, index) in roles"
          :key="role.id"
          class="role-card cc-fade-in"
          :class="{ selected: selectedRole === role.id }"
          role="radio"
          :aria-checked="selectedRole === role.id"
          tabindex="0"
          :style="{ animationDelay: `${index * 60}ms` }"
          @click="handleSelect(role.id)"
          @keydown="handleKeyDown($event, role.id)"
        >
          <div class="role-icon dsp-flex-jstf-center-plc-center">
            <component
              :is="role.icon"
              :size="19"
              :color="selectedRole === role.id ? '#fff' : '#94A3B8'"
            />
          </div>

          <div class="role-text">
            <div class="t">{{ role.label }}</div>
            <div class="d">{{ role.description }}</div>
          </div>

          <div
            class="role-check dsp-flex-jstf-center-plc-center"
            :class="{ empty: selectedRole !== role.id }"
          >
            <Check
              v-if="selectedRole === role.id"
              :size="12"
              color="#fff"
              :stroke-width="3"
            />
          </div>
        </div>
      </div>

      <p v-if="error" class="error-text">
        {{ error }}
      </p>

      <button
        type="button"
        class="continue-btn dsp-flex-jstf-center-plc-center"
        :class="{ active: selectedRole, disabled: !selectedRole || isSaving }"
        :disabled="!selectedRole || isSaving"
        @click="handleContinue"
      >
        <span
          v-if="isSaving"
          class="btn-content dsp-flex-jstf-center-plc-center"
        >
          <Loader2 :size="16" class="spinner" />
          Saving...
        </span>

        <span v-else>
          Continue
        </span>
      </button>

      <p class="fine-print-role">
        You can switch or add roles anytime in Settings.
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-role {
  width: 100%;
  min-height: 100vh;
  background: var(--slate-900); 
  position: absolute;
  top: 0;
  left: 0;
}

.auth-role-main-ctn {
  padding: 2vh;
  width: 40%;
  margin-top: 14vh;
}

.topnav { 
  padding: 2vh 0 1vh; 
}

.back { 
  width: 3vh; 
  height: 3vh; 
  border-radius: 50%; 
  background: var(--slate-800); 
  color: var(--slate-400); 
  cursor: pointer;
  border: none;
}

.steps { 
  display: flex; 
  gap: 1.2em; 
}

.steps .dot { 
  width: 18px; 
  height: 5px; 
  border-radius: 3px; 
  background: var(--slate-700); 
}

.steps .dot.active { 
  background: var(--grad-signature); 
}

.scr-h1 { 
  font-family: var(--display-font); 
  font-weight: 700; 
  font-size: 3.6vh; 
  line-height: 1.2; 
  margin-bottom: 1vh; 
}

.scr-sub { 
  font-size: 2vh; 
  color: var(--slate-400); 
  line-height: 1.5; 
  margin-bottom: 24px; 
}

.role-list { 
  display: flex; 
  flex-direction: column; 
  gap: 3vh; 
  margin-bottom: 18px; 
}

.role-card { 
  display: flex; 
  align-items: center; 
  gap: 13px; 
  border: 1.5px solid var(--slate-700); 
  border-radius: 16px; 
  padding: 13px 14px; 
  background: var(--slate-800); 
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.role-card:hover {
  border-color: var(--purple-500);
  transform: translateY(-1px);
}

.role-card:focus-visible {
  outline: 2px solid var(--purple-500);
  outline-offset: 2px;
}

.role-card.selected { 
  border-color: var(--purple-500); 
  background: rgba(109, 40, 217, 0.14); 
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18); 
}

.role-icon { 
  width: 38px; 
  height: 38px; 
  border-radius: 11px; 
  background: var(--slate-700); 
  flex-shrink: 0; 
}

.role-card.selected .role-icon { 
  background: var(--grad-signature); 
}

.role-text {
  flex: 1;
  min-width: 0;
}

.role-text .t { 
  font-weight: 700; 
  font-size: 2vh; 
  margin-bottom: 2px; 
}

.role-text .d { 
  font-size: 1.4vh; 
  color: var(--slate-400); 
  line-height: 1.3; 
}

.role-check { 
  margin-left: auto; 
  width: 20px; 
  height: 20px; 
  border-radius: 50%; 
  background: var(--grad-signature); 
  color: #fff; 
  font-size: 11px; 
  flex-shrink: 0;
}

.role-check.empty { 
  background: transparent; 
  border: 1.5px solid var(--slate-600); 
}

.error-text {
  font-size: 1.5vh;
  color: #FCA5A5;
  margin-bottom: 10px;
}

.continue-btn {
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 1.8vh;
  border-radius: 14px;
  padding: 15px 0;
  margin-top: 14px;
  margin-bottom: 16px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.continue-btn.active {
  background: var(--grad-signature);
  color: #fff;
}

.continue-btn.disabled {
  background: var(--slate-800);
  color: var(--slate-600);
  cursor: not-allowed;
}

.continue-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-content {
  gap: 8px;
}

.spinner {
  animation: ccSpin 0.8s linear infinite;
}

.fine-print-role {
  text-align: center;
  font-size: 1.3vh;
  color: var(--slate-600);
  line-height: 1.5;
}

.cc-fade-in {
  animation: ccFadeIn 0.35s ease backwards;
}

@keyframes ccFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ccSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .role-card,
  .continue-btn,
  .cc-fade-in {
    animation: none !important;
    transition: none !important;
  }
}

@media screen and (max-width: 1050px) and (min-width: 951px) {
  .auth-role-main-ctn {
    width: 60%;
  }
}

@media screen and (max-width: 950px) {
  .auth-role-main-ctn {
    width: 100%;
  }
}
</style>