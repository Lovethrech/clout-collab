<script setup>
import AuthTopNav from '~/components/molecules/AuthTopNav.vue'
import RoleCard from '~/components/molecules/RoleCard.vue'

defineProps({
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