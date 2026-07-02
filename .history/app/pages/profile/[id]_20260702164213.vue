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
    justify-content: center;
}

.profile-shell {
    width: 100%;
    background: #0b1322;
    border: 1px solid #2a3b55;
    overflow: hidden;
}

.cover {
    height: 20vh;
    background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 52%, #ec4899 100%);
    position: relative;
}

.cover-nav {
    position: absolute;
    top: 38px;
    left: 16px;
    right: 16px;
    display: flex;
    justify-content: space-between;
    margin: 0 4vw;
}

.cover-nav button {
    width: 52px;
    height: 52px;
    border: 0;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.45);
    color: #fff;
    font-size: 2vh;
    font-weight: 800;
    cursor: pointer;
}

.profile-head {
    position: relative;
    padding: 0 6vw 20px;
}

.avatar {
    width: 184px;
    height: 184px;
    border-radius: 50%;
    border: 4px solid #0b1322;
    margin-top: -42px;
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    display: grid;
    place-items: center;
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    font-size: 22px;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.featured-badge {
    position: absolute;
    top: 16px;
    right: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.2vh;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #fff;
    background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 52%, #ec4899 100%);
    padding: 5px 10px;
    margin-right: 6vw;
    border-radius: 20px;
}

.name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
}

.name-row h1 {
    font-family: 'Unbounded', sans-serif;
    font-size: 3vh;
}

.verified {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 11px;
    font-weight: 800;
}

.role-line {
    color: #94a3b8;
    margin-top: 4px;
    font-size: 2vh;
}

.bio-text {
    color: #e2e8f0;
    margin-top: 14px;
    line-height: 1.6;
    font-size: 1.8vh;
}

.stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid #1e293b;
    border-bottom: 1px solid #1e293b;
    margin-top: 18px;
    padding: 14px 0;
}

.stat-col {
    text-align: center;
    border-right: 1px solid #1e293b;
}

.stat-col:last-child {
    border-right: 0;
}

.num {
    font-family: 'JetBrains Mono', monospace;
    color: #f9a8d4;
    font-weight: 700;
    font-size: 1.6vh;
}

.lbl {
    color: #94a3b8;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-top: 3px;
}

.tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 14px;
}

.tag-chip {
    color: #c4b5fd;
    background: rgba(139, 92, 246, 0.14);
    border: 1px solid rgba(139, 92, 246, 0.3);
    padding: 6px 11px;
    border-radius: 999px;
    font-size: 1.6vh;
}

.skills-row .tag-chip {
    color: #93c5fd;
    background: rgba(59, 130, 246, 0.14);
    border-color: rgba(59, 130, 246, 0.3);
}

.social-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 3vh;
}

.social-row a {
    color: #f8fafc;
    text-decoration: none;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 999px;
    padding: 7px 11px;
    font-size: 1.2vh;
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




.portfolio-grid {
    display: grid;
    gap: 14px;
}

.portfolio-card {
    background: #1e293b;
    border: 1px solid #2a3b55;
    border-radius: 18px;
    overflow: hidden;
}

.portfolio-thumb {
    height: 180px;
    background: linear-gradient(135deg, #6d28d9, #3b82f6);
    position: relative;
    overflow: hidden;
}

.portfolio-thumb img,
.portfolio-thumb video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.portfolio-category {
    position: absolute;
    left: 12px;
    bottom: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    background: rgba(15, 23, 42, 0.65);
    color: #fff;
    padding: 5px 10px;
    border-radius: 999px;
}

.portfolio-body {
    padding: 14px;
}

.portfolio-body h3 {
    font-family: 'Unbounded', sans-serif;
    font-size: 14px;
    margin-bottom: 8px;
}

.portfolio-meta {
    display: flex;
    gap: 12px;
    color: #94a3b8;
    font-size: 12px;
}

.empty-portfolio {
    color: #94a3b8;
    background: #1e293b;
    border: 1px dashed #334155;
    border-radius: 14px;
    padding: 16px;
    font-size: 13px;
}

.profile-cta {
    position: sticky;
    bottom: 0;
    padding: 14px 6vw 18px;
    background: #0b1322;
    border-top: 1px solid #1e293b;
}

.profile-cta button {
    width: 100%;
    border: 0;
    border-radius: 14px;
    padding: 14px;
    color: #fff;
    font-size:2vh;
    font-weight: 800;
    background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 52%, #ec4899 100%);
    cursor: pointer;
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