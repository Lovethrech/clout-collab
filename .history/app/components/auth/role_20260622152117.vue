<script setup>
import { ref } from 'vue'
import AuthTopNav from '~/components/molecules/AuthTopNav.vue'
import RoleCard from '~/components/molecules/RoleCard.vue'

const props = defineProps({
  showRoleBox: {
    type: Function,
    required: true
  },

  modelValue: {
    type: String,
    default: 'creator'
  }
})

const emit = defineEmits(['update:modelValue', 'select-role'])

const roles = [
  {
    id: 'creator',
    title: 'Creator',
    description: 'Content, video, photo & more',
    icon: 'creator'
  },
  {
    id: 'musician',
    title: 'Musician',
    description: 'Singers, producers, DJs & more',
    icon: 'musician'
  },
  {
    id: 'brand',
    title: 'Brand',
    description: 'Hiring creators for campaigns',
    icon: 'brand'
  },
  {
    id: 'creative-pro',
    title: 'Creative Pro',
    description: 'Editors, designers, animators',
    icon: 'creative-pro'
  }
]

function handleSelectRole(role) {
  emit('update:modelValue', role.id)
  emit('select-role', role)
}
</script>

<template>
  <div class="auth-role dsp-flex-jstf-center-plc-center">
    <div class="auth-role-main-ctn">
      <AuthTopNav
        :on-back="showRoleBox"
        :total-steps="2"
        :active-step="1"
      />

      <div class="scr-h1">What brings you here?</div>
      <div class="scr-sub">
        Pick what fits best, you can add more later.
      </div>

      <div class="role-list">
        <RoleCard
          v-for="role in roles"
          :key="role.id"
          :role="role"
          :selected="modelValue === role.id"
          @select="handleSelectRole"
        />
      </div>
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
    margin-bottom: 2vh; 
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