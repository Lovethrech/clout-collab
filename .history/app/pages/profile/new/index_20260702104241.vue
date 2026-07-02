<script setup>
const router = useRouter()
const user = useSupabaseUser()
const { getMyProfile, upsertMyProfile } = useProfile()

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  role: 'creator',
  bio: '',
  location: '',
  city: '',
  country: '',
  nicheInput: '',
  skillsInput: '',
  instagram: '',
  tiktok: '',
  youtube: '',
  website: '',
  profile_image: ''
})

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  try {
    const existingProfile = await getMyProfile()

    if (existingProfile) {
      form.name = existingProfile.name || ''
      form.role = existingProfile.role || 'creator'
      form.bio = existingProfile.bio || ''
      form.location = existingProfile.location || ''
      form.city = existingProfile.city || ''
      form.country = existingProfile.country || ''
      form.nicheInput = existingProfile.niche ? existingProfile.niche.join(', ') : ''
      form.skillsInput = existingProfile.skills ? existingProfile.skills.join(', ') : ''
      form.instagram = existingProfile.social_links?.instagram || ''
      form.tiktok = existingProfile.social_links?.tiktok || ''
      form.youtube = existingProfile.social_links?.youtube || ''
      form.website = existingProfile.social_links?.website || ''
      form.profile_image = existingProfile.profile_image || ''
    }
  } catch (error) {
    errorMessage.value = error.message || 'Could not load profile.'
  }
})

const saveProfile = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const savedProfile = await upsertMyProfile({
      name: form.name,
      role: form.role,
      bio: form.bio,
      location: form.location,
      city: form.city,
      country: form.country,
      niche: form.nicheInput
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item),
      skills: form.skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill),
      social_links: {
        instagram: form.instagram,
        tiktok: form.tiktok,
        youtube: form.youtube,
        website: form.website
      },
      profile_image: form.profile_image,
      is_visible: true
    })

    router.push(`/profile/${savedProfile.id}`)
  } catch (error) {
    errorMessage.value = error.message || 'Could not save profile.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="profile-new-page">
    <section class="profile-card">
      <p class="eyebrow">Day 03 · Profile Setup</p>

      <h1>Build your profile</h1>

      <p class="subtitle">
        Add the details brands and collaborators need before they message you.
      </p>

      <form class="profile-form" @submit.prevent="saveProfile">
        <label>
          Full name / Brand name
          <input v-model="form.name" required placeholder="Dolapo Ade" />
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
          Bio
          <textarea
            v-model="form.bio"
            rows="4"
            placeholder="Music video & UGC specialist. Open to collaborations."
          />
        </label>

        <label>
          Location
          <input v-model="form.location" placeholder="Lagos, Nigeria" />
        </label>

        <div class="two-column">
          <label>
            City
            <input v-model="form.city" placeholder="Lagos" />
          </label>

          <label>
            Country
            <input v-model="form.country" placeholder="Nigeria" />
          </label>
        </div>

        <label>
          Niche
          <input
            v-model="form.nicheInput"
            placeholder="Music Video, UGC, Brand Campaigns"
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
          Profile image URL
          <input
            v-model="form.profile_image"
            placeholder="https://example.com/profile-image.jpg"
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

        <label>
          Website / Portfolio URL
          <input v-model="form.website" placeholder="https://yourportfolio.com" />
        </label>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save profile' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.profile-new-page {
  min-height: 100vh;
  background: #0b1322;
  color: #f8fafc;
  padding: 32px 20px;
  display: flex;
  justify-content: center;
}

.profile-card {
  width: 100%;
  max-width: 620px;
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

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
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

@media (max-width: 640px) {
  .two-column {
    grid-template-columns: 1fr;
  }

  .profile-card {
    padding: 22px;
  }
}
</style>