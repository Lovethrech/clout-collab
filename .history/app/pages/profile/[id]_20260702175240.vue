<script setup>
definePageMeta({
    layout: false 
})
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const profile = ref(null)
const portfolioItems = ref([])
const loading = ref(true)
const errorMessage = ref('')

const getProfile = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        const profileId = route.params.id

        const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single()

        if (profileError) {
        throw profileError
        }

        const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

        if (portfolioError) {
        throw portfolioError
        }

        profile.value = profileData
        portfolioItems.value = portfolioData || []
    } catch (error) {
        errorMessage.value = error.message || 'Could not load profile.'
    } finally {
        loading.value = false
    }
}

const formatRole = (role) => {
    if (!role) return 'Creator'

    return role
        .replace('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

onMounted(() => {
    getProfile()
})
</script>

<template>
    <main class="profile-page">
        <div v-if="loading" class="state">
        Loading profile...
        </div>

        <div v-else-if="errorMessage" class="state error">
        {{ errorMessage }}
        </div>

        <section v-else class="profile-shell">
        <div class="cover">
            <div class="cover-nav">
                <button type="button" @click="router.push('/directory')">‹</button>
                <button type="button">•••</button>
            </div>
        </div>

        <div class="profile-head">
            <div class="avatar">
            <img
                v-if="profile.profile_image"
                :src="profile.profile_image"
                :alt="profile.name"
            />

            <span v-else>
                {{ profile.name ? profile.name.slice(0, 2).toUpperCase() : 'CC' }}
            </span>
            </div>

            <span v-if="profile.profile_completed" class="featured-badge">
            ★ Active Profile
            </span>

            <div class="name-row">
            <h1>{{ profile.name }}</h1>
            <span class="verified">✓</span>
            </div>

            <p class="role-line">
            {{ formatRole(profile.role) }}
            <span v-if="profile.location"> · {{ profile.location }}</span>
            </p>

            <p v-if="profile.bio" class="bio-text">
            {{ profile.bio }}
            </p>

            <div class="stats-row">
            <div class="stat-col">
                <div class="num">0</div>
                <div class="lbl">Views</div>
            </div>

            <div class="stat-col">
                <div class="num">{{ portfolioItems.length }}</div>
                <div class="lbl">Projects</div>
            </div>

            <div class="stat-col">
                <div class="num">New</div>
                <div class="lbl">Status</div>
            </div>
            </div>

            <div v-if="profile.niche && profile.niche.length" class="tag-row">
            <span
                v-for="item in profile.niche"
                :key="item"
                class="tag-chip"
            >
                {{ item }}
            </span>
            </div>

            <div v-if="profile.skills && profile.skills.length" class="tag-row skills-row">
            <span
                v-for="skill in profile.skills"
                :key="skill"
                class="tag-chip"
            >
                {{ skill }}
            </span>
            </div>

            <div class="social-row">
            <a
                v-if="profile.social_links?.instagram"
                :href="profile.social_links.instagram"
                target="_blank"
                rel="noopener noreferrer"
            >
                Instagram
            </a>

            <a
                v-if="profile.social_links?.tiktok"
                :href="profile.social_links.tiktok"
                target="_blank"
                rel="noopener noreferrer"
            >
                TikTok
            </a>

            <a
                v-if="profile.social_links?.youtube"
                :href="profile.social_links.youtube"
                target="_blank"
                rel="noopener noreferrer"
            >
                YouTube
            </a>

            <a
                v-if="profile.social_links?.website"
                :href="profile.social_links.website"
                target="_blank"
                rel="noopener noreferrer"
            >
                Website
            </a>
            </div>

            <div class="mini-portfolio-label">
            <span class="t">Portfolio</span>
            <span class="a">See all ({{ portfolioItems.length }}) →</span>
            </div>

            <div v-if="portfolioItems.length" class="portfolio-grid">
            <article
                v-for="item in portfolioItems"
                :key="item.id"
                class="portfolio-card"
            >
                <div class="portfolio-thumb">
                <video
                    v-if="item.is_video"
                    :src="item.media_url"
                    controls
                />

                <img
                    v-else
                    :src="item.thumbnail_url || item.media_url"
                    :alt="item.title"
                />

                <span class="portfolio-category">
                    {{ item.category || 'Project' }}
                </span>
                </div>

                <div class="portfolio-body">
                <h3>{{ item.title }}</h3>

                <div class="portfolio-meta">
                    <span>{{ item.view_count || 0 }} views</span>
                    <span>{{ item.like_count || 0 }} likes</span>
                </div>
                </div>
            </article>
            </div>

            <p v-else class="empty-portfolio">
            No portfolio projects yet.
            </p>
        </div>

        <div class="profile-cta">
            <button type="button">
            Message
            </button>
        </div>
        </section>
    </main>
</template>

<style scoped>
.profile-page {
    min-height: 100vh;
    background: #0f172a;
    color: #f8fafc;
    display: flex;
    justify-content:center;
}


.mini-portfolio-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4vh;
    margin-bottom: 12px;
}

.mini-portfolio-label .t {
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    font-size: 2vh;
}

.mini-portfolio-label .a {
    font-family: 'JetBrains Mono', monospace;
    color: #93c5fd;
    font-size: 1vh;
}



.state {
    color: #94a3b8;
    padding-top: 80px;
}

.error {
    color: #ef4444;
}

@media (max-width: 480px) {
    .profile-page {
        padding: 0;
    }

    .profile-shell {
        min-height: 100vh;
        border-radius: 0;
        border-left: 0;
        border-right: 0;
    }
}
</style>