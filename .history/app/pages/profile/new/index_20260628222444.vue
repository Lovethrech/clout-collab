<script setup>
definePageMeta({
  layout: false,
  middleware: 'auth'
})
</script>

<template>
    <section class="profile-new-page">
        <ProfileNewHeader />
        <ProfileNewForm />
    </section>
</template>