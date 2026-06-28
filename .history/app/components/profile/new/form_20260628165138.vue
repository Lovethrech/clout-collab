<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

/**
 * Page State
 */
const loading = ref(false)
const btnText = ref('Save Info')
const errorMessage = ref('')
const successMessage = ref('')

/**
 * Constants
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const STORAGE_BUCKETS = {
    profileImages: 'profile-images',
    portfolioProjects: 'portfolio-projects'
}

/**
 * File Upload Refs
 */
const profileImageInput = ref(null)
const projectInput = ref(null)

const profileImageFile = ref(null)
const profileImagePreview = ref('')

const projectFile = ref(null)
const projectFileName = ref('')

/**
 * User/Profile State
 */
const userRole = ref('creator')

const form = ref({
    name: '',
    bio: '',
    location: '',
    niche: [],
    skills: [],
    social_links: {
        instagram: '',
        snapchat: ''
    }
})

/**
 * Dropdown State
 */
const dropdowns = ref({
    niche: false,
    skills: false
})

/**
 * Role-Based Options
 */
const roleOptions = {
    creator: {
        niches: [
        'Short-form video',
        'Long-form video',
        'Live streaming',
        'Gaming',
        'Lifestyle/Vlog',
        'Comedy/Skits',
        'Beauty',
        'Fashion',
        'Travel',
        'Food',
        'Education',
        'Fitness'
        ],
        skills: [
        'Short-form video editing',
        'Long-form video editing',
        'Scriptwriting',
        'Content strategy',
        'Photography',
        'Videography',
        'Community management',
        'Brand storytelling',
        'Canva design',
        'CapCut editing'
        ]
    },

    musician: {
        niches: [
        'Afrobeats',
        'Hip-hop',
        'R&B',
        'Gospel',
        'Pop',
        'DJ mixes',
        'Instrumentals',
        'Song covers',
        'Live performance',
        'Music education'
        ],
        skills: [
        'Music production',
        'Sound design',
        'Songwriting',
        'Vocal recording',
        'Mixing',
        'Mastering',
        'Beat making',
        'Live performance',
        'DJing',
        'Audio editing'
        ]
    },

    brand: {
        niches: [
        'Fashion brand',
        'Beauty brand',
        'Food and beverage',
        'Tech brand',
        'Lifestyle brand',
        'Fitness brand',
        'Travel brand',
        'Education brand',
        'Events',
        'E-commerce'
        ],
        skills: [
        'Campaign planning',
        'Influencer marketing',
        'Social media strategy',
        'Brand management',
        'Content briefing',
        'Paid ads',
        'Community engagement',
        'Analytics reporting',
        'Partnership management',
        'Creative direction'
        ]
    },

    creative_professional: {
        niches: [
        'Video editing',
        'Graphic design',
        'Animation',
        'Photography',
        'UI/UX design',
        'Motion graphics',
        'Copywriting',
        'Creative direction',
        'Brand identity',
        '3D design'
        ],
        skills: [
        'Adobe Premiere Pro',
        'After Effects',
        'Photoshop',
        'Illustrator',
        'Figma',
        'Motion design',
        'Photo retouching',
        'Brand design',
        'Copywriting',
        'Project management'
        ]
    }
}

/**
 * Computed Options
 */
const nicheOptions = computed(() => {
    return roleOptions[userRole.value]?.niches || roleOptions.creator.niches
})

const skillOptions = computed(() => {
    return roleOptions[userRole.value]?.skills || roleOptions.creator.skills
})

/**
 * Multi-Select Dropdown Methods
 */
const toggleDropdown = (field) => {
    dropdowns.value[field] = !dropdowns.value[field]
}

const closeDropdown = (field) => {
    dropdowns.value[field] = false
}

const toggleOption = (field, option) => {
    const selectedOptions = form.value[field]

    if (selectedOptions.includes(option)) {
        form.value[field] = selectedOptions.filter((item) => item !== option)
        return
    }

    form.value[field] = [...selectedOptions, option]
}

const removeOption = (field, option) => {
    form.value[field] = form.value[field].filter((item) => item !== option)
}

const isSelected = (field, option) => {
    return form.value[field].includes(option)
}

const getSelectedText = (field, placeholder) => {
    const selectedCount = form.value[field].length

    if (!selectedCount) {
        return placeholder
    }

    return `${selectedCount} selected`
}

/**
 * File Picker Methods
 */
const openProfileImagePicker = () => {
    profileImageInput.value?.click()
}

const openProjectPicker = () => {
    projectInput.value?.click()
}

/**
 * File Validation
 */
const validateFileSize = (file, message) => {
    if (file.size > MAX_FILE_SIZE) {
        errorMessage.value = message
        return false
    }

    return true
}

const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    errorMessage.value = ''

    if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Profile image must be an image file.'
        return
    }

    const isValidSize = validateFileSize(
        file,
        'Profile image must not exceed 5MB.'
    )

    if (!isValidSize) return

    profileImageFile.value = file
    profileImagePreview.value = URL.createObjectURL(file)
}

const handleProjectChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    errorMessage.value = ''

    const isValidSize = validateFileSize(
        file,
        'Project file must not exceed 5MB.'
    )

    if (!isValidSize) return

    projectFile.value = file
    projectFileName.value = file.name
}

/**
 * Supabase Storage Upload
 */
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

/**
 * Load Existing Profile
 */
const loadProfile = async () => {
    if (!user.value) {
        await router.push('/login')
        return
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('name, bio, location, role, niche, skills, social_links, profile_completed')
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

    form.value = {
        name: data?.name || '',
        bio: data?.bio || '',
        location: data?.location || '',
        niche: data?.niche || [],
        skills: data?.skills || [],
        social_links: {
            instagram: data?.social_links?.instagram || '',
            snapchat: data?.social_links?.snapchat || ''
        }
    }
}

/**
 * Form Validation
 */
const validateForm = () => {
    errorMessage.value = ''

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

    if (!form.value.social_links.instagram.trim()) {
        errorMessage.value = 'Instagram handle is required.'
        return false
    }

    if (!form.value.social_links.snapchat.trim()) {
        errorMessage.value = 'Snapchat handle is required.'
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

/**
 * Build Update Payload
 */
const buildProfilePayload = async () => {
    let profileImageUrl = null
    const portfolioProjects = []

    if (profileImageFile.value) {
        profileImageUrl = await uploadFile({
        bucket: STORAGE_BUCKETS.profileImages,
        file: profileImageFile.value,
        folder: user.value.id
        })
    }

    if (projectFile.value) {
        const projectUrl = await uploadFile({
        bucket: STORAGE_BUCKETS.portfolioProjects,
        file: projectFile.value,
        folder: user.value.id
        })

        portfolioProjects.push({
        name: projectFile.value.name,
        url: projectUrl,
        uploaded_at: new Date().toISOString()
        })
    }

    const payload = {
        name: form.value.name.trim(),
        email: user.value.email,
        bio: form.value.bio.trim(),
        location: form.value.location.trim(),
        social_links: {
        instagram: form.value.social_links.instagram.trim(),
        snapchat: form.value.social_links.snapchat.trim()
        },
        niche: form.value.niche,
        skills: form.value.skills,
        profile_completed: true,
        updated_at: new Date().toISOString()
    }

    if (profileImageUrl) {
        payload.profile_image = profileImageUrl
    }

    if (portfolioProjects.length) {
        payload.portfolio_projects = portfolioProjects
    }

    return payload
}

/**
 * Submit Profile
 */
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

    const updatePayload = await buildProfilePayload()

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

                <div class="multi-select-wrapper">
                    <button
                    type="button"
                    class="multi-select-trigger"
                    @click="toggleDropdown('niche')"
                    >
                    <span>
                        {{ getSelectedText('niche', 'Select niche options') }}
                    </span>

                    <span class="multi-select-arrow">
                        {{ showNicheDropdown ? '▲' : '▼' }}
                    </span>
                    </button>

                    <div v-if="dropdowns.niche" class="multi-select-dropdown">
                    <label
                        v-for="option in nicheOptions"
                        :key="option"
                        class="multi-select-option"
                    >
                        <input
                        type="checkbox"
                        :checked="isSelected('niche', option)"
                        @change="toggleOption('niche', option)"
                        />

                        <span>{{ option }}</span>
                    </label>
                    </div>

                    <div v-if="form.niche.length" class="selected-tags">
                    <span
                        v-for="item in form.niche"
                        :key="item"
                        class="selected-tag"
                    >
                        {{ item }}

                        <button
                        type="button"
                        class="selected-tag-remove"
                        @click="removeOption('niche', item)"
                        >
                        ×
                        </button>
                    </span>
                    </div>
                </div>
            </div>

            <div class="profile-new-user-form-input-and-label-field">
                <label for="skills" class="profile-new-user-form-label">
                    Skills: select at least 5
                </label>

                <div class="multi-select-wrapper">
                    <button
                    type="button"
                    class="multi-select-trigger"
                    @click="toggleDropdown('skills')" 
                    >
                    <span>
                        {{ getSelectedText('skills', 'Select skill options') }}
                    </span>

                    <span class="multi-select-arrow">
                        {{ showSkillsDropdown ? '▲' : '▼' }}
                    </span>
                    </button>

                    <div v-if="dropdowns.skills" class="multi-select-dropdown">
                    <label
                        v-for="option in skillOptions"
                        :key="option"
                        class="multi-select-option"
                    >
                        <input
                        type="checkbox"
                        :checked="isSelected('skills', option)"
                        @change="toggleOption('skills', option)"
                        />

                        <span>{{ option }}</span>
                    </label>
                    </div>

                    <div v-if="form.skills.length" class="selected-tags">
                    <span
                        v-for="item in form.skills"
                        :key="item"
                        class="selected-tag"
                    >
                        {{ item }}

                        <button
                        type="button"
                        class="selected-tag-remove"
                        @click="removeOption('skills', item)"
                        >
                        ×
                        </button>
                    </span>
                    </div>
                </div>
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
    color: var(--error);
    text-align: center;
    margin-bottom: 1vh;
}

.success-message {
    color: var(--success);
    text-align: center;
    margin-bottom: 1vh;
}
.multi-select-wrapper {
    position: relative;
    width: 100%;
}

.multi-select-trigger {
    width: 100%;
    min-height: 48px;
    padding: 0 16px;
    border: 1px solid var(--slate-700);
    border-radius: 10px;
    background: var(--slate-800);
    color: var(--slate-200);
    font-family: var(--body-font);
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.multi-select-arrow {
    font-size: 12px;
    color: var(--slate-400);
}

.multi-select-dropdown {
    position: absolute;
    top: 110%;
    left: 0;
    z-index: 20;
    width: 100%;
    max-height: 240px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid var(--slate-700);
    border-radius: 10px;
    background: var(--slate-900);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

.multi-select-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 8px;
    color: var(--slate-200);
    font-family: var(--body-font);
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    text-transform: capitalize;
}

.multi-select-option:hover {
    background: rgba(255, 255, 255, 0.08);
}

.multi-select-option input {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.selected-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 999px;
    background: var(--slate-700);
    color: var(--slate-100);
    font-size: 13px;
    font-family: var(--body-font);
}

.selected-tag-remove {
    border: none;
    background: transparent;
    color: var(--slate-300);
    font-size: 16px;
    cursor: pointer;
    line-height: 1;
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