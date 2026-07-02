<script setup>
definePageMeta(
    layout: 'false'
)
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)
const loadingProfile = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

const profileImageFile = ref(null)
const profileImagePreview = ref('')

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

const portfolioProjects = ref([
    {
        title: '',
        category: '',
        file: null,
        preview: '',
        is_video: false
    }
])

const safeFileName = (fileName) => {
    return fileName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9.-]/g, '')
}

const uploadFileToBucket = async (bucketName, file) => {
  if (!user.value || !file) return ''

    const fileExt = file.name.split('.').pop()
    const cleanName = safeFileName(file.name)
    const filePath = `${user.value.id}/${Date.now()}-${cleanName || `upload.${fileExt}`}`

    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
        })

    if (uploadError) {
        throw uploadError
    }

    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

    return data.publicUrl
}

const handleProfileImageChange = (event) => {
    const file = event.target.files[0]

    if (!file) return

    profileImageFile.value = file
    profileImagePreview.value = URL.createObjectURL(file)
}

const handlePortfolioFileChange = (event, index) => {
    const file = event.target.files[0]

    if (!file) return

    portfolioProjects.value[index].file = file
    portfolioProjects.value[index].preview = URL.createObjectURL(file)
    portfolioProjects.value[index].is_video = file.type.startsWith('video/')
}

const addPortfolioProject = () => {
    portfolioProjects.value.push({
        title: '',
        category: '',
        file: null,
        preview: '',
        is_video: false
    })
}

const removePortfolioProject = (index) => {
    if (portfolioProjects.value.length === 1) {
        portfolioProjects.value[0] = {
        title: '',
        category: '',
        file: null,
        preview: '',
        is_video: false
        }

        return
    }

    portfolioProjects.value.splice(index, 1)
}

const loadExistingProfile = async () => {
    if (!user.value) {
        router.push('/login')
        return
    }

    loadingProfile.value = true
    errorMessage.value = ''

    try {
        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

        if (error && error.code !== 'PGRST116') {
        throw error
        }

        if (data) {
        form.name = data.name || ''
        form.role = data.role || 'creator'
        form.bio = data.bio || ''
        form.location = data.location || ''
        form.city = data.city || ''
        form.country = data.country || ''
        form.nicheInput = data.niche ? data.niche.join(', ') : ''
        form.skillsInput = data.skills ? data.skills.join(', ') : ''
        form.instagram = data.social_links?.instagram || ''
        form.tiktok = data.social_links?.tiktok || ''
        form.youtube = data.social_links?.youtube || ''
        form.website = data.social_links?.website || ''
        form.profile_image = data.profile_image || ''
        profileImagePreview.value = data.profile_image || ''
        }
    } catch (error) {
        errorMessage.value = error.message || 'Could not load profile.'
    } finally {
        loadingProfile.value = false
    }
}

const saveProfile = async () => {
    if (!user.value) {
        router.push('/login')
        return
    }

    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        let profileImageUrl = form.profile_image

        if (profileImageFile.value) {
        profileImageUrl = await uploadFileToBucket('profile-images', profileImageFile.value)
        }

        const nicheArray = form.nicheInput
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item)

        const skillsArray = form.skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill)

        const profilePayload = {
        id: user.value.id,
        name: form.name,
        email: user.value.email,
        role: form.role,
        bio: form.bio,
        location: form.location,
        city: form.city,
        country: form.country,
        niche: nicheArray,
        skills: skillsArray,
        social_links: {
            instagram: form.instagram,
            tiktok: form.tiktok,
            youtube: form.youtube,
            website: form.website
        },
        profile_image: profileImageUrl,
        profile_completed: true,
        is_visible: true,
        updated_at: new Date().toISOString()
        }

        const { data: savedProfile, error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload)
        .select()
        .single()

        if (profileError) {
        throw profileError
        }

        const completedPortfolioProjects = portfolioProjects.value.filter((project) => {
        return project.title && project.file
        })

        if (completedPortfolioProjects.length) {
        const uploadedPortfolioRows = []

        for (const project of completedPortfolioProjects) {
            const mediaUrl = await uploadFileToBucket('portfolio-media', project.file)

            uploadedPortfolioRows.push({
            profile_id: user.value.id,
            title: project.title,
            category: project.category,
            media_url: mediaUrl,
            thumbnail_url: project.is_video ? null : mediaUrl,
            is_video: project.is_video
            })
        }

        const { error: portfolioError } = await supabase
            .from('portfolio_items')
            .insert(uploadedPortfolioRows)

        if (portfolioError) {
            throw portfolioError
        }
        }

        successMessage.value = 'Profile saved successfully.'
        router.push(`/profile/${savedProfile.id}`)
    } catch (error) {
        errorMessage.value = error.message || 'Could not save profile.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  loadExistingProfile()
})
</script>

<template>
  <main class="profile-new-page">
        <section class="profile-card">

        <h1>Build your profile</h1>

        <p class="subtitle">
            Add your profile details, upload a profile image, and add portfolio projects
            that brands or collaborators can review.
        </p>

        <div v-if="loadingProfile" class="loading-box">
            Loading profile...
        </div>

        <form v-else class="profile-form" @submit.prevent="saveProfile">
            <div class="section-title-row">
            <h2>Basic information</h2>
            </div>

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
            Profile image
            <input
                type="file"
                accept="image/*"
                @change="handleProfileImageChange"
            />
            </label>

            <div v-if="profileImagePreview" class="profile-preview">
            <img :src="profileImagePreview" alt="Profile preview" />
            </div>

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

            <div class="section-title-row">
            <h2>Social links</h2>
            </div>

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

            <div class="section-title-row portfolio-title-row">
            <div>
                <h2>Portfolio</h2>
                <p>Add one or more portfolio projects. Each project needs a title and media file.</p>
            </div>

            <button
                type="button"
                class="small-btn"
                @click="addPortfolioProject"
            >
                Add project
            </button>
            </div>

            <div
            v-for="(project, index) in portfolioProjects"
            :key="index"
            class="portfolio-form-card"
            >
            <div class="portfolio-card-head">
                <strong>Project {{ index + 1 }}</strong>

                <button
                type="button"
                class="remove-btn"
                @click="removePortfolioProject(index)"
                >
                Remove
                </button>
            </div>

            <label>
                Project title
                <input
                v-model="project.title"
                placeholder="Lagos Nights — Visualizer"
                />
            </label>

            <label>
                Category
                <input
                v-model="project.category"
                placeholder="Music Video, UGC Campaign, Brand Promo"
                />
            </label>

            <label>
                Media file
                <input
                type="file"
                accept="image/*,video/*"
                @change="handlePortfolioFileChange($event, index)"
                />
            </label>

            <div v-if="project.preview" class="portfolio-preview">
                <video
                v-if="project.is_video"
                :src="project.preview"
                controls
                />

                <img
                v-else
                :src="project.preview"
                alt="Portfolio preview"
                />
            </div>
            </div>

            <p v-if="errorMessage" class="error">
            {{ errorMessage }}
            </p>

            <p v-if="successMessage" class="success">
            {{ successMessage }}
            </p>

            <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Saving profile...' : 'Save profile' }}
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
    max-width: 680px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 24px;
    padding: 28px;
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

.loading-box {
    color: #94a3b8;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 14px;
    padding: 16px;
}

.profile-form {
    display: grid;
    gap: 16px;
}

.section-title-row {
    margin-top: 10px;
    padding-top: 18px;
    border-top: 1px solid #334155;
}

.section-title-row h2 {
    font-family: 'Unbounded', sans-serif;
    font-size: 16px;
    margin-bottom: 4px;
}

.section-title-row p {
    color: #94a3b8;
    font-size: 13px;
    line-height: 1.5;
}

.portfolio-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

input[type='file'] {
    padding: 11px;
}

textarea {
    resize: vertical;
}

.profile-preview {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #8b5cf6;
    background: #0f172a;
}

.profile-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.portfolio-form-card {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 18px;
    padding: 18px;
    display: grid;
    gap: 14px;
}

.portfolio-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.portfolio-card-head strong {
    font-family: 'Unbounded', sans-serif;
    font-size: 14px;
}

.portfolio-preview {
    border-radius: 16px;
    overflow: hidden;
    background: #020617;
    border: 1px solid #334155;
}

.portfolio-preview img,
.portfolio-preview video {
    width: 100%;
    max-height: 260px;
    object-fit: cover;
    display: block;
}

.small-btn,
.remove-btn {
    border: 1px solid #475569;
    border-radius: 999px;
    padding: 9px 13px;
    background: #0f172a;
    color: #f8fafc;
    font-weight: 700;
    cursor: pointer;
}

.remove-btn {
    color: #fca5a5;
    border-color: rgba(239, 68, 68, 0.4);
}

.submit-btn {
    border: 0;
    border-radius: 14px;
    padding: 15px;
    color: #fff;
    font-weight: 800;
    background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 52%, #ec4899 100%);
    cursor: pointer;
}

.submit-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.error {
    color: #ef4444;
    font-size: 13px;
}

.success {
    color: #22c55e;
    font-size: 13px;
}

@media (max-width: 640px) {
    .two-column,
    .portfolio-title-row {
        grid-template-columns: 1fr;
        display: grid;
    }

    .profile-card {
        padding: 22px;
    }

    h1 {
        font-size: 24px;
    }
}
</style>