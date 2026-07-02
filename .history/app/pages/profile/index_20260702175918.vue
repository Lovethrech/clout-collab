<script setup>
definePageMeta({
  layout: 'verifiedUser'
})

const router = useRouter()
const supabase = useSupabaseClient()

const profile = ref(null)
const portfolioItems = ref([])
const loading = ref(true)
const errorMessage = ref('')

const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error('You must be logged in to view your profile.')
  }

  return data.user
}

const getMyProfile = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const currentUser = await getCurrentUser()

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single()

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        router.push('/profile/new')
        return
      }

      throw profileError
    }

    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('profile_id', currentUser.id)
      .order('created_at', { ascending: false })

    if (portfolioError) {
      throw portfolioError
    }

    profile.value = profileData
    portfolioItems.value = portfolioData || []
  } catch (error) {
    errorMessage.value = error.message || 'Could not load profile.'

    if (error.message === 'You must be logged in to view your profile.') {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

const formatRole = (role) => {
  if (!role) return 'Creator'

  return role
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const getInitials = (name) => {
  if (!name) return 'CC'

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const goToEditProfile = () => {
  router.push('/profile/new')
}

onMounted(() => {
  getMyProfile()
})
</script>

<template>
    <main class="my-profile-page">
        <div v-if="loading" class="profile-state">
        Loading profile...
        </div>

        <div v-else-if="errorMessage" class="profile-state error">
        {{ errorMessage }}
        </div>

        <section v-else class="profile-shell">
        <div class="cover">
            <div class="cover-nav">
            <button type="button" @click="router.push('/directory')">
                ←
            </button>

            <button type="button" @click="goToEditProfile">
                Edit
            </button>
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
                {{ getInitials(profile.name) }}
            </span>
            </div>

            <span v-if="profile.profile_completed" class="featured-badge">
            ★ My Profile
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
                <div class="num">Live</div>
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

            <div class="portfolio-label">
            <span>Portfolio</span>
            <small>{{ portfolioItems.length }} projects</small>
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
            <button type="button" @click="goToEditProfile">
            Edit Profile
            </button>
        </div>
        </section>
    </main>
</template>

<style scoped>
.my-profile-page {
  min-height: 100vh;
  background:
      radial-gradient(circle at top left, rgba(109, 40, 217, 0.16), transparent 34%),
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 32%),
      var(--cc-bg);
  color: var(--cc-text);
  padding: 24px 14px 10px;
  display: flex;
  justify-content: center;
}
.portfolio-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
  margin-bottom: 12px;
}

.portfolio-label span {
  font-weight: 900;
  font-size: 15px;
}

.portfolio-label small {
  color: var(--cc-blue-lt);
  font-size: 11px;
  font-weight: 800;
}


.profile-state {
  color: var(--cc-muted);
  padding-top: 80px;
}

@media (max-width: 480px) {
    .my-profile-page {
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
    }
}
</style>