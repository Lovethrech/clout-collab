<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const loading = ref(false)
const btnText = ref('Save Info')
const errorMessage = ref('')
const successMessage = ref('')

const MAX_FILE_SIZE = 5 * 1024 * 1024

const profileImageInput = ref(null)
const projectInput = ref(null)

const profileImageFile = ref(null)
const profileImagePreview = ref('')

const projectFile = ref(null)
const projectFileName = ref('')

const userRole = ref('creator')

const form = ref({
    name: '',
    bio: '',
    location: '',
    niche: [],
    skills: []
})

const roleOptions = {
    creator: {
        niches: ['Short-form video','Long-form video','Live streaming','Gaming','Lifestyle/Vlog','Comedy/Skits','Beauty','Fashion','Travel','Food','Education','Fitness'],
        skills: ['Short-form video editing','Long-form video editing','Scriptwriting','Content strategy','Photography','Videography','Community management','Brand storytelling','Canva design','CapCut editing']
    },
    musician: {
        niches: ['Afrobeats','Hip-hop','R&B','Gospel','Pop','DJ mixes','Instrumentals','Song covers','Live performance','Music education'],
        skills: ['Music production','Sound design','Songwriting','Vocal recording','Mixing','Mastering','Beat making','Live performance','DJing','Audio editing']
    },
    brand: {
        niches: ['Fashion brand','Beauty brand','Food and beverage','Tech brand','Lifestyle brand','Fitness brand','Travel brand','Education brand','Events','E-commerce'],
        skills: ['Campaign planning','Influencer marketing','Social media strategy','Brand management','Content briefing','Paid ads','Community engagement','Analytics reporting','Partnership management','Creative direction']
    },
    creative_professional: {
        niches: ['Video editing','Graphic design','Animation','Photography','UI/UX design','Motion graphics','Copywriting','Creative direction','Brand identity','3D design'],
        skills: ['Adobe Premiere Pro','After Effects','Photoshop','Illustrator','Figma','Motion design','Photo retouching','Brand design','Copywriting','Project management']
    }
}

const nicheOptions = computed(() => {
    return roleOptions[userRole.value]?.niches || roleOptions.creator.niches
})
const skillOptions = computed(() => {
    return roleOptions[userRole.value]?.skills || roleOptions.creator.skills
})
const openProfileImagePicker = () => {
    profileImageInput.value?.click()
}
const openProjectPicker = () => {
    projectInput.value?.click()
}
const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Profile image must be an image file.'
        return
    }

    if (file.size > MAX_FILE_SIZE) {
        errorMessage.value = 'Profile image must not exceed 5MB.'
        return
    }

    profileImageFile.value = file
    profileImagePreview.value = URL.createObjectURL(file)
}

const handleProjectChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
        errorMessage.value = 'Project file must not exceed 5MB.'
        return
    }

    projectFile.value = file
    projectFileName.value = file.name
}

const uploadFile = async ({ bucket, file, folder }) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
        })

    if (error) throw error

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return data.publicUrl
}

const loadProfile = async () => {
    if (!user.value) {
        await router.push('/login')
        return
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('name, bio, location, role, niche, skills, profile_completed')
        .eq('id', user.value.id)
        .single()

    if (error) {
        errorMessage.value = error.message
        return
    }

    if (data?.profile_completed) {
        await router.push('/profile')
        return
    }

    userRole.value = data?.role || 'creator'

    form.value.name = data?.name || ''
    form.value.bio = data?.bio || ''
    form.value.location = data?.location || ''
    form.value.niche = data?.niche || []
    form.value.skills = data?.skills || []
}

const validateForm = () => {
    if (!form.value.name.trim()) {
        errorMessage.value = 'Full name is required.'
        return false
    }

    if (!form.value.bio.trim()) {
        errorMessage.value = 'Bio is required.'
        return false
    }

    if (!form.value.location.trim()) {
        errorMessage.value = 'Location is required.'
        return false
    }

    if (form.value.niche.length < 5) {
        errorMessage.value = 'Please select at least 5 niche options.'
        return false
    }

    if (form.value.skills.length < 5) {
        errorMessage.value = 'Please select at least 5 skill options.'
        return false
    }

    return true
}

const handleSubmit = async () => {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        if (!user.value) {
        await router.push('/login')
        return
        }

        if (!validateForm()) return

        let profileImageUrl = null
        let portfolioProjects = []

        if (profileImageFile.value) {
        profileImageUrl = await uploadFile({
            bucket: 'profile-images',
            file: profileImageFile.value,
            folder: user.value.id
        })
        }

        if (projectFile.value) {
        const projectUrl = await uploadFile({
            bucket: 'portfolio-projects',
            file: projectFile.value,
            folder: user.value.id
        })

        portfolioProjects.push({
            name: projectFile.value.name,
            url: projectUrl,
            uploaded_at: new Date().toISOString()
        })
        }

        const updatePayload = {
        name: form.value.name,
        email: user.value.email,
        bio: form.value.bio,
        location: form.value.location,
        niche: form.value.niche,
        skills: form.value.skills,
        profile_completed: true,
        updated_at: new Date().toISOString()
        }

        if (profileImageUrl) {
        updatePayload.profile_image = profileImageUrl
        }

        if (portfolioProjects.length > 0) {
        updatePayload.portfolio_projects = portfolioProjects
        }

        const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.value.id)

        if (error) throw error

        successMessage.value = 'Profile saved successfully.'
        await router.push('/profile')
    } catch (error) {
        console.error('Profile save error:', error)
        errorMessage.value = error.message || 'Unable to save profile.'
    } finally {
        loading.value = false
    }
}

onMounted(loadProfile)
</script>

<template>
    <div class="profile-new-form">
        <form class="profile-new-user-form" @submit.prevent="handleSubmit">
        <div class="profile-new-user-form-img-ctn-bg">
            <div
            class="profile-new-user-form-img-ctn dsp-flex-jstf-center-plc-center"
            @click="openProfileImagePicker"
            >
            <img
                v-if="profileImagePreview"
                :src="profileImagePreview"
                alt="Profile preview"
                class="profile-preview-img"
            />

            <div v-else class="profile-new-user-form-img-ctn-empty">
                <p class="profile-new-user-form-img-ctn-desc-sign">+</p>
                <p class="profile-new-user-form-img-ctn-desc">Image Upload</p>
            </div>

            <input
                ref="profileImageInput"
                type="file"
                accept="image/*"
                hidden
                @change="handleProfileImageChange"
            />
            </div>
        </div>

        <div class="profile-new-user-form-input-and-label-field-and-portfolio-ctn">
            <div class="profile-new-user-form-input-and-label-field-ctn">
            <div class="profile-new-user-form-input-and-label-field">
                <label for="fullName" class="profile-new-user-form-label">
                Full Name:
                </label>
                <input
                v-model="form.name"
                type="text"
                id="fullName"
                class="profile-new-user-form-input"
                placeholder="John Doe"
                required
                />
            </div>

            <div class="profile-new-user-form-input-and-label-field">
                <label for="bio" class="profile-new-user-form-label">
                Bio:
                </label>
                <textarea
                v-model="form.bio"
                id="bio"
                class="profile-new-user-form-input"
                placeholder="Tell people about yourself..."
                required
                ></textarea>
            </div>

            <div class="profile-new-user-form-input-and-label-field">
                <label for="niche" class="profile-new-user-form-label">
                Niche: select at least 5
                </label>
                <select
                v-model="form.niche"
                id="niche"
                class="profile-new-user-form-input profile-new-user-form-input-select"
                multiple
                required
                >
                <option
                    v-for="option in nicheOptions"
                    :key="option"
                    :value="option"
                    class="profile-new-user-form-input-select-option"
                >
                    {{ option }}
                </option>
                </select>
            </div>

            <div class="profile-new-user-form-input-and-label-field">
                <label for="skills" class="profile-new-user-form-label">
                Skills: select at least 5
                </label>
                <select
                v-model="form.skills"
                id="skills"
                class="profile-new-user-form-input profile-new-user-form-input-select"
                multiple
                required
                >
                <option
                    v-for="option in skillOptions"
                    :key="option"
                    :value="option"
                    class="profile-new-user-form-input-select-option"
                >
                    {{ option }}
                </option>
                </select>
            </div>

            <div class="profile-new-user-form-input-and-label-field">
                <label for="location" class="profile-new-user-form-label">
                Location:
                </label>
                <input
                v-model="form.location"
                type="text"
                id="location"
                class="profile-new-user-form-input"
                placeholder="City, Country"
                required
                />
            </div>
            </div>

            <hr />

            <div class="profile-new-user-form-input-and-label-portfolio-ctn profile-new-user-form-label">
            Portfolio:
            <div
                class="profile-new-user-form-input-and-label-portfolio-empty dsp-flex-jstf-center-plc-center"
                @click="openProjectPicker"
            >
                <p class="profile-new-user-form-input-and-label-portfolio-empty-sign">
                +
                </p>
                <p class="profile-new-user-form-input-and-label-portfolio-empty-desc">
                {{ projectFileName || 'Add sample project' }}
                </p>

                <input
                ref="projectInput"
                type="file"
                hidden
                @change="handleProjectChange"
                />
            </div>
            </div>
        </div>

        <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="success-message">
            {{ successMessage }}
        </p>

        <button
            type="submit"
            class="btn-main-auth profile-new-user-form-btn"
            :disabled="loading"
        >
            <p class="btn-main-auth-text">
            {{ loading ? 'Adding to database...' : btnText }}
            </p>
        </button>
        </form>
    </div>
</template>

<style scoped>
.profile-new-user-form-img-ctn-bg {
    width: 100%;
    height: 20vh;
    background: var(--grad-signature);
    display: flex;
    justify-content: end;
    align-items: end;
}

.profile-new-user-form-img-ctn {
    width: 200px;
    height: 200px;
    background-color: var(--slate-700);
    margin-bottom: -10vh;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    overflow: hidden;
}

.profile-new-user-form-img-ctn:hover {
    transform: scale(0.98);
}

.profile-preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-new-user-form-img-ctn-empty {
    text-align: center;
    font-family: var(--body-font);
    font-size: 16px;
    font-weight: 700;
}

.profile-new-user-form-img-ctn-desc-sign {
    font-size: 36px;
}

.profile-new-user-form-input-and-label-field-and-portfolio-ctn {
    margin-top: 7vh;
    padding: 2vh 6vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 3vh;
    margin-bottom: 3vh;
}

.profile-new-user-form-input-and-label-field-ctn,
.profile-new-user-form-input-and-label-portfolio-ctn {
    width: 50%;
}

.profile-new-user-form-input-and-label-field {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 2vh;
}

.profile-new-user-form-label {
    font-family: var(--mono-font);
    color: var(--slate-200);
    font-weight: 500;
}

.profile-new-user-form-input-select {
    text-transform: capitalize;
    min-height: 18vh;
}

.profile-new-user-form-input-select-option {
    text-transform: capitalize;
}

.profile-new-user-form-input-and-label-portfolio-ctn {
  height: 56vh;
}

.profile-new-user-form-input-and-label-portfolio-empty {
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.137);
  border: 0.5vh dashed var(--slate-900);
  margin-top: 2vh;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.profile-new-user-form-input-and-label-portfolio-empty:hover {
  transform: scale(0.99);
}

.profile-new-user-form-input-and-label-portfolio-empty-sign {
  font-size: 40px;
}

.profile-new-user-form-input-and-label-portfolio-empty-desc {
  font-size: 20px;
}

.error-message {
  color: #ef4444;
  text-align: center;
  margin-bottom: 1vh;
}

.success-message {
  color: #22c55e;
  text-align: center;
  margin-bottom: 1vh;
}

@media screen and (max-width: 990px) {
  .profile-new-user-form-input-and-label-field-and-portfolio-ctn {
    flex-direction: column;
  }

  .profile-new-user-form-input-and-label-field-ctn,
  .profile-new-user-form-input-and-label-portfolio-ctn {
    width: 100%;
  }

  .profile-new-user-form-input-and-label-portfolio-ctn {
    height: 26vh;
  }
}
</style>