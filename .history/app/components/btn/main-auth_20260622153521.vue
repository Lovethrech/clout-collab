<script setup>
defineProps({
  btnText: {
    type: String,
    required: true
  },
  onClick: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <button type="button" class="btn-main-auth" @click="onClick">
    {{ btnText }}
  </button>
</template>