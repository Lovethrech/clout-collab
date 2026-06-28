<script setup>
definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const errorMessage = ref('')

const getUserDisplayName = (user) => {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    ''
  )
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
    const code = route.query.code

    /**
     * Only exchange code if this is truly an OAuth callback.
     */
    if (code && typeof code === 'string') {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) throw error
    }

    /**
     * Wait briefly for Supabase Nuxt client to hydrate session.
     */
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData?.session) {
      await router.push('/login')
      return
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError

    const authUser = userData?.user

    if (!authUser) {
      await router.push('/login')
      return
    }

    const profile = await createOrRepairGoogleProfile(authUser)

    if (!profile.role || !profile.profile_completed) {
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
        <NuxtLink to="/login">Back to login</NuxtLink>
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