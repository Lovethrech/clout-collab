<script setup>
const title = 'Clout Collabs | Authentication'
const description = ''

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const supabase = useSupabaseClient()
const router = useRouter()

const authTitle = ref('Welcome back')
const authDesc = ref('Log in to keep the conversation going.')
const loading = ref(false)
const googleLoading = ref(false)
const btnText = ref('Login')
const authQ = ref('New to Clout Collabs?')
const authQLinkDesc = ref('Create an account')
const authQLink = ref('/signup')

const form = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')

const getRedirectUrl = () => {
  return `${window.location.origin}/auth/callback`
}

const handleGoogleAuth = async () => {
  googleLoading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl()
      }
    })

    if (error) throw error
  } catch (error) {
    console.error('Google auth error:', error)
    errorMessage.value = error.message || 'Unable to continue with Google.'
    googleLoading.value = false
  }
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!form.value.email || !form.value.password) {
      errorMessage.value = 'Email and password are required.'
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    if (error) throw error

    const user = data.user

    if (!user) {
      errorMessage.value = 'Unable to find logged-in user.'
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, profile_completed')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) throw profileError

    if (!profile) {
      await router.push('/profile/new')
      return
    }

    if (!profile?.role) {
      await router.push('/profile/new')
      return
    }

    if (!profile.profile_completed) {
      await router.push('/profile/new')
      return
    }

    await router.push('/profile')
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <AuthTitle :authTitle="authTitle" />

    <AuthDesc :authDesc="authDesc" />

    <form class="auth-page-form" @submit.prevent="handleLogin">
      <AuthBtnGoogle
        :loading="googleLoading"
        text="Continue with Google"
        @click="handleGoogleAuth"
      />

      <div class="divider">
        <span class="line"></span>
        <span>or log in with email</span>
        <span class="line"></span>
      </div>

      <div class="form-email-and-password-ctn">
        <input
          v-model="form.email"
          class="form-email-and-password"
          id="form-email"
          type="email"
          placeholder="Email address"
          required
        />

        <input
          v-model="form.password"
          class="form-email-and-password"
          id="form-password"
          type="password"
          placeholder="Password"
          required
        />
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <button type="submit" class="btn-main-auth" :disabled="loading">
        <p class="btn-main-auth-text">
          {{ loading ? 'Logging in...' : btnText }}
        </p>
      </button>
    </form>

    <br />

    <AuthQuestion
      :authQ="authQ"
      :authQLinkDesc="authQLinkDesc"
      :authQLink="authQLink"
    />

    <div class="fine-print">
      By continuing, you agree to the Terms<br />
      and Privacy Policy.
    </div>
  </div>
</template>

<style scoped>
.auth-page-form {
  margin-top: 4vh;
}

.divider {
  display: flex;
  align-items: center;
  gap: 2vh;
  margin-bottom: 2vh;
}

.divider .line {
  flex: 1;
  height: 0.1vh;
  background: var(--slate-700);
}

.divider span {
  font-size: 1.4vh;
  color: var(--slate-400);
}

.error-message {
  color: #ef4444;
  font-size: 1.5vh;
  margin-top: 1vh;
  margin-bottom: 1vh;
  text-align: center;
}

.fine-print {
  text-align: center;
  font-size: 1.8vh;
  color: var(--slate-600);
  line-height: 1.5;
}
</style>