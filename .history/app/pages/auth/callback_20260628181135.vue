<script setup>
definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const loading = ref(true)
const errorMessage = ref('')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getUserDisplayName = (authUser) => {
  return (
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.user_metadata?.display_name ||
    ''
  )
}

const waitForSession = async () => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const { data } = await supabase.auth.getSession()

    if (data?.session?.user) {
      return data.session.user
    }

    if (user.value) {
      return user.value
    }

    await sleep(300)
  }

  return null
}

const createOrRepairGoogleProfile = async (authUser) => {
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, role, profile_completed')
    .eq('id', authUser.id)
    .maybeSingle()

  if (fetchError) throw fetchError

  if (existingProfile) {
    return existingProfile
  }

  const { data: createdProfile, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: authUser.id,
      email: authUser.email,
      name: getUserDisplayName(authUser),
      role: 'creator',
      social_links: {
        instagram: '',
        snapchat: ''
      },
      profile_completed: false
    })
    .select('id, role, profile_completed')
    .single()

  if (insertError) throw insertError

  return createdProfile
}

const handleCallback = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const authUser = await waitForSession()

    if (!authUser) {
      errorMessage.value = 'No active authentication session found. Please log in again with Google.'
      return
    }

    const profile = await createOrRepairGoogleProfile(authUser)

    if (!profile.profile_completed) {
      await router.push('/profile/new')
      return
    }

    await router.push('/profile')
  } catch (error) {
    console.error('Google auth callback error:', error)
    errorMessage.value = error.message || 'Unable to complete Google authentication.'
  } finally {
    loading.value = false
  }
}

onMounted(handleCallback)
</script>

<template>
    <section class="auth-callback-page">
        <div class="auth-callback-card">
        <h1 v-if="loading">Completing authentication...</h1>

        <template v-else-if="errorMessage">
            <h1>Authentication failed</h1>
            <p>{{ errorMessage }}</p>

            <NuxtLink to="/login">
            Back to login
            </NuxtLink>
        </template>
        </div>
    </section>
</template>

<style scoped>
.auth-callback-page {
    width: 100%;
    min-height: 100vh;
    background: var(--slate-900);
    color: var(--slate-200);
    display: flex;
    justify-content: center;
    align-items: center;
}

.auth-callback-card {
    width: min(90%, 480px);
    padding: 4vh;
    border-radius: 20px;
    background: var(--slate-800);
    border: 1px solid var(--slate-700);
    text-align: center;
}

.auth-callback-card h1 {
    font-family: var(--display-font);
    font-size: 3vh;
    margin-bottom: 1vh;
}

.auth-callback-card p {
    color: var(--slate-400);
    margin-bottom: 2vh;
}

.auth-callback-card a {
    color: var(--blue-300);
    font-weight: 700;
}
</style>