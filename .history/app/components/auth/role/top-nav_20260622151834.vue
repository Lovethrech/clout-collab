<script setup>
import BackButton from '~/components/atoms/BackButton.vue'
import StepDots from '~/components/atoms/StepDots.vue'

defineProps({
  onBack: {
    type: Function,
    required: true
  },
  totalSteps: {
    type: Number,
    default: 2
  },
  activeStep: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div class="topnav dsp-flex-jstf-center-plc-spcbtw">
    <BackButton :on-click="onBack" />

    <StepDots
      :total="totalSteps"
      :active-index="activeStep"
    />

    <div class="spacer"></div>
  </div>
</template>

<style scoped>
.topnav { 
    padding: 0 0 1vh; 
}

.spacer {
    width: 30px;
}
</style>