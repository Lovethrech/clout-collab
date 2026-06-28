<script setup>
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

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

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const googleLoading = ref(false)
const errorMessage = ref('')
const showRoleSelector = ref(false)
const pendingUserData = ref(null)
const step = ref('signup')

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
        redirectTo: getRedirectUrl(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) throw error
  } catch (error) {
    console.error('Google signup error:', error)
    errorMessage.value = error.message || 'Unable to continue with Google.'
    googleLoading.value = false
  }
}

const handleNextStep = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!form.value.email.trim() || !form.value.password.trim()) {
      errorMessage.value = 'Email and password are required.'
      return
    }

    if (form.value.password.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters.'
      return
    }

    pendingUserData.value = {
      email: form.value.email.trim(),
      password: form.value.password
    }

    showRoleSelector.value = true
    step.value = 'role'
  } catch (error) {
    console.error('Error during signup:', error)
    errorMessage.value = 'An error occurred during signup. Please try again.'
  } finally {
    loading.value = false
  }
}

const createOrRepairProfile = async ({ userId, email, selectedRole }) => {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        role: selectedRole,
        social_links: {
          instagram: '',
          snapchat: ''
        },
        profile_completed: false,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'id'
      }
    )

  if (error) throw error
}

const finalizeSignUp = async (selectedRole) => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!pendingUserData.value?.email || !pendingUserData.value?.password) {
      errorMessage.value = 'Missing signup details. Please start again.'
      step.value = 'signup'
      showRoleSelector.value = false
      return
    }

    if (!selectedRole) {
      errorMessage.value = 'Please select a role.'
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: pendingUserData.value.email,
      password: pendingUserData.value.password,
      options: {
        data: {
          role: selectedRole
        }
      }
    })

    if (error) throw error

    const signedUpUser = data?.user
    const session = data?.session

    if (!signedUpUser) {
      errorMessage.value = 'Unable to create user account.'
      return
    }

    if (session) {
      await createOrRepairProfile({
        userId: signedUpUser.id,
        email: signedUpUser.email,
        selectedRole
      })

      await router.push('/profile/new')
      return
    }

    alert('Sign up successful! Please check your email to confirm your account.')
    await router.push('/login')
  } catch (error) {
    console.error('Error during finalizing signup:', error)
    errorMessage.value =
      error.message || 'An error occurred during finalizing signup. Please try again.'
  } finally {
    loading.value = false
  }
}

const goBackToSignup = () => {
  step.value = 'signup'
  showRoleSelector.value = false
}
</script>

<template>
  <div class="auth-page">
    <div v-if="step === 'signup'" class="auth-page-main-ctn">
      <AuthTitle :authTitle="'Create your account'" />

      <AuthDesc :authDesc="'Join creators, musicians, and brands building together.'" />

      <form @submit.prevent="handleNextStep" class="auth-page-form">
        <AuthBtnGoogle
        :loading="googleLoading"
        text="Continue with Google"
        @click="handleGoogleAuth"
      />>

        <div class="divider">
          <span class="line"></span>
          <span>or sign up with email</span>
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
            {{ loading ? 'Processing...' : 'Create Account' }}
          </p>
        </button>
      </form>

      <br />

      <AuthQuestion
        :authQ="'Already have an account?'"
        :authQLinkDesc="'Log in'"
        :authQLink="'/login'"
      />

      <div class="fine-print">
        By continuing, you agree to the Terms<br />
        and Privacy Policy.
      </div>
    </div>

    <AuthRole
      v-if="step === 'role'"
      :step="step"
      :pendingUserData="pendingUserData"
      :showRoleSelector="showRoleSelector"
      :loading="loading"
      @complete="finalizeSignUp"
      @back="goBackToSignup"
    />
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