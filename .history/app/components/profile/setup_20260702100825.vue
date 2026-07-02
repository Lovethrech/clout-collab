<script setup lang="ts">
const router = useRouter()
const user = useSupabaseUser()
const { getMyProfile, upsertMyProfile } = useProfile()

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  display_name: '',
  username: '',
  role: 'creator',
  title: '',
  location: '',
  bio: '',
  skillsInput: '',
  instagram: '',
  tiktok: '',
  youtube: ''
})

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  const existingProfile = await getMyProfile()

  if (existingProfile) {
    form.display_name = existingProfile.display_name || ''
    form.username = existingProfile.username || ''
    form.role = existingProfile.role || 'creator'
    form.title = existingProfile.title || ''
    form.location = existingProfile.location || ''
    form.bio = existingProfile.bio || ''
    form.skillsInput = existingProfile.skills?.join(', ') || ''
    form.instagram = existingProfile.socials?.instagram || ''
    form.tiktok = existingProfile.socials?.tiktok || ''
    form.youtube = existingProfile.socials?.youtube || ''
  }
})

const saveProfile = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const saved = await upsertMyProfile({
      display_name: form.display_name,
      username: form.username,
      role: form.role,
      title: form.title,
      location: form.location,
      bio: form.bio,
      skills: form.skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      socials: {
        instagram: form.instagram,
        tiktok: form.tiktok,
        youtube: form.youtube
      }
    })

    router.push(`/profile/${saved.id}`)
  } catch (error: any) {
    errorMessage.value = error.message || 'Could not save profile.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="profile-setup-page">
    <section class="setup-card">
      <p class="eyebrow">Day 03 · Profile Setup</p>

      <h1>Build your creator profile</h1>
      <p class="subtitle">
        Add the details brands and collaborators need before they message you.
      </p>

      <form @submit.prevent="saveProfile" class="profile-form">
        <label>
          Display name
          <input v-model="form.display_name" required placeholder="Dolapo Ade" />
        </label>

        <label>
          Username
          <input v-model="form.username" placeholder="dolapoade" />
        </label>

        <label>
          Role
          <select v-model="form.role">
            <option value="creator">Creator</option>
            <option value="musician">Musician</option>
            <option value="brand">Brand</option>
            <option value="creative_professional">Creative Pro</option>
          </select>
        </label>

        <label>
          Title
          <input v-model="form.title" placeholder="Videographer" />
        </label>

        <label>
          Location
          <input v-model="form.location" placeholder="Lagos, Nigeria" />
        </label>

        <label>
          Bio
          <textarea
            v-model="form.bio"
            rows="4"
            placeholder="Music video & UGC specialist. Open to collaborations."
          />
        </label>

        <label>
          Skills
          <input
            v-model="form.skillsInput"
            placeholder="Videography, Color Grading, Drone"
          />
        </label>

        <label>
          Instagram URL
          <input v-model="form.instagram" placeholder="https://instagram.com/..." />
        </label>

        <label>
          TikTok URL
          <input v-model="form.tiktok" placeholder="https://tiktok.com/@..." />
        </label>

        <label>
          YouTube URL
          <input v-model="form.youtube" placeholder="https://youtube.com/..." />
        </label>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save profile' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.profile-setup-page {
  min-height: 100vh;
  background: #0b1322;
  color: #f8fafc;
  padding: 32px 20px;
  display: flex;
  justify-content: center;
}

.setup-card {
  width: 100%;
  max-width: 560px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 24px;
  padding: 28px;
}

.eyebrow {
  color: #f9a8d4;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

h1 {
  font-family: 'Unbounded', sans-serif;
  font-size: 28px;
  margin-bottom: 10px;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 24px;
  line-height: 1.5;
}

.profile-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #334155;
  background: #0f172a;
  color: #f8fafc;
  border-radius: 14px;
  padding: 13px 14px;
  font: inherit;
}

textarea {
  resize: vertical;
}

button {
    border: 0;
    border-radius: 14px;
    padding: 15px;
    color: #fff;
    font-weight: 800;
    background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 52%, #ec4899 100%);
    cursor: pointer;
}

button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.error {
    color: #ef4444;
    font-size: 13px;
}
</style>