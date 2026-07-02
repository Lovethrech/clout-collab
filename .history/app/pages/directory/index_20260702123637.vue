<script setup>
definePageMeta({
    layout: 'verified'
})
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)
const errorMessage = ref('')
const profiles = ref([])

const searchQuery = ref('')
const activeRole = ref('All')
const activeLocation = ref('All')
const activeSort = ref('Recently Active')

const roleFilters = [
    {
        label: 'All',
        value: 'All'
    },
    {
        label: 'Creators',
        value: 'creator'
    },
    {
        label: 'Musicians',
        value: 'musician'
    },
    {
        label: 'Creative Pros',
        value: 'creative_professional'
    },
    {
        label: 'Brands',
        value: 'brand'
    }
]

const locationFilters = [
    {
        label: '🌍 All Locations',
        value: 'All'
    },
    {
        label: '📍 Lagos',
        value: 'Lagos'
    },
    {
        label: '📍 Abuja',
        value: 'Abuja'
    },
    {
        label: '✈️ International',
        value: 'International'
    }
]

const sortOptions = [
    'Recently Active',
    'Newest First',
    'A-Z'
]

const getProfiles = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            portfolio_items (
            id,
            title,
            category,
            media_url,
            thumbnail_url,
            is_video,
            view_count,
            like_count
            )
        `)
        .eq('profile_completed', true)
        .eq('is_visible', true)
        .order('updated_at', { ascending: false })

        if (error) {
        throw error
        }

        profiles.value = data || []
    } catch (error) {
        errorMessage.value = error.message || 'Could not load directory.'
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

const getLocationLabel = (profile) => {
    if (profile.location) return profile.location

    if (profile.city && profile.country) {
        return `${profile.city}, ${profile.country}`
    }

    if (profile.city) return profile.city
    if (profile.country) return profile.country

    return 'Location not set'
}

const getProfileHandle = (profile) => {
    if (!profile.name) return '@cloutcollabs'

    return `@${profile.name.toLowerCase().replace(/\s+/g, '')}`
}

const getRoleClass = (role) => {
    if (role === 'musician') return 'role-musician'
    if (role === 'brand') return 'role-brand'
    if (role === 'creative_professional') return 'role-creative-pro'
    return 'role-creator'
}

const matchesLocation = (profile) => {
    if (activeLocation.value === 'All') return true

    const city = profile.city || ''
    const country = profile.country || ''
    const location = profile.location || ''

    if (activeLocation.value === 'International') {
        return !['Nigeria', 'NG'].includes(country) && !location.toLowerCase().includes('nigeria')
    }

    return (
        city.toLowerCase().includes(activeLocation.value.toLowerCase()) ||
        location.toLowerCase().includes(activeLocation.value.toLowerCase())
    )
}

const filteredProfiles = computed(() => {
    let result = profiles.value.filter((profile) => {
        const roleMatches =
        activeRole.value === 'All' || profile.role === activeRole.value

        const locationMatches = matchesLocation(profile)

        const query = searchQuery.value.trim().toLowerCase()

        const searchableText = [
        profile.name,
        profile.role,
        profile.bio,
        profile.location,
        profile.city,
        profile.country,
        ...(profile.niche || []),
        ...(profile.skills || [])
        ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

        const searchMatches = !query || searchableText.includes(query)

        return roleMatches && locationMatches && searchMatches
    })

    if (activeSort.value === 'A-Z') {
        result = [...result].sort((a, b) => {
        return (a.name || '').localeCompare(b.name || '')
        })
    }

    if (activeSort.value === 'Newest First') {
        result = [...result].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
        })
    }

    return result
})

const changeSort = () => {
    const currentIndex = sortOptions.indexOf(activeSort.value)
    const nextIndex = currentIndex + 1 >= sortOptions.length ? 0 : currentIndex + 1
    activeSort.value = sortOptions[nextIndex]
}

const clearFilters = () => {
    searchQuery.value = ''
    activeRole.value = 'All'
    activeLocation.value = 'All'
    activeSort.value = 'Recently Active'
}

const goToProfile = (profileId) => {
    router.push(`/profile/${profileId}`)
}

const goToMyProfile = () => {
    if (user.value?.id) {
        router.push(`/profile/${user.value.id}`)
        return
    }

    router.push('/login')
}

const goToNewProfile = () => {
    router.push('/profile/new')
}

onMounted(() => {
    getProfiles()
})
</script>

<template>
    <main class="directory-page">

        <section class="page-head">
        <h1 class="page-title">Discover Creators</h1>
        <p class="page-sub">Find talent to collaborate with & hire</p>
        </section>

        <section class="search-wrap">
        <div class="search-inner">
            <span class="search-ico">🔍</span>

            <input
            v-model="searchQuery"
            class="search-inp"
            type="search"
            placeholder="Search by name, niche, or skill…"
            autocomplete="off"
            />

            <button class="filter-ico-btn" type="button" title="Advanced filters">
            ⚙️
            </button>
        </div>
        </section>

        <section class="filters">
        <div class="chip-row">
            <button
            v-for="role in roleFilters"
            :key="role.value"
            type="button"
            class="chip"
            :class="{ 'active-role': activeRole === role.value }"
            @click="activeRole = role.value"
            >
            <span v-if="role.value !== 'All'" class="chip-dot"></span>
            {{ role.label }}
            </button>
        </div>

        <div class="chip-row">
            <button
            v-for="location in locationFilters"
            :key="location.value"
            type="button"
            class="chip"
            :class="{ 'active-loc': activeLocation === location.value }"
            @click="activeLocation = location.value"
            >
            {{ location.label }}
            </button>
        </div>
        </section>

        <section class="results-bar">
        <p class="results-count">
            <strong>{{ filteredProfiles.length }}</strong>
            {{ filteredProfiles.length === 1 ? 'creator' : 'creators' }} found
        </p>

        <button class="sort-btn" type="button" @click="changeSort">
            {{ activeSort }} ↓
        </button>
        </section>

        <section class="grid">
        <div v-if="loading" class="empty-state">
            <div class="empty-ico">⏳</div>
            <div class="empty-title">Loading directory...</div>
            <p class="empty-body">Fetching creators, musicians, brands, and creative pros.</p>
        </div>

        <div v-else-if="errorMessage" class="empty-state">
            <div class="empty-ico">⚠️</div>
            <div class="empty-title">Could not load directory</div>
            <p class="empty-body">{{ errorMessage }}</p>
        </div>

        <div v-else-if="!filteredProfiles.length" class="empty-state">
            <div class="empty-ico">🔍</div>
            <div class="empty-title">No creators found</div>
            <p class="empty-body">Try adjusting your filters or search terms.</p>

            <button class="empty-clear" type="button" @click="clearFilters">
            Clear filters
            </button>
        </div>

        <article
            v-for="profile in filteredProfiles"
            v-else
            :key="profile.id"
            class="card"
            :class="[getRoleClass(profile.role), { 'is-featured': profile.profile_completed }]"
        >
            <div v-if="profile.profile_completed" class="feat-badge">
            ⭐ Featured
            </div>

            <div class="card-head">
            <div class="avatar-wrap">
                <div class="avatar">
                <img
                    v-if="profile.profile_image"
                    :src="profile.profile_image"
                    :alt="profile.name"
                />

                <span v-else>
                    {{ getInitials(profile.name) }}
                </span>

                <div class="avatar-ring"></div>
                </div>

                <div class="online-dot"></div>
            </div>

            <div class="name-block">
                <div class="creator-name">
                {{ profile.name || 'Unnamed Profile' }}
                </div>

                <div class="creator-handle">
                {{ getProfileHandle(profile) }}
                </div>
            </div>
            </div>

            <div class="card-meta">
            <span class="role-badge">
                {{ formatRole(profile.role) }}
            </span>

            <span class="location-pill">
                <span class="loc-dot"></span>
                {{ getLocationLabel(profile) }}
            </span>
            </div>

            <p class="card-bio">
            {{ profile.bio || 'This profile is ready for new collaborations.' }}
            </p>

            <div class="tags">
            <span
                v-for="item in [...(profile.niche || []), ...(profile.skills || [])].slice(0, 4)"
                :key="item"
                class="tag"
            >
                {{ item }}
            </span>
            </div>

            <button
            class="card-cta"
            type="button"
            @click="goToProfile(profile.id)"
            >
            View Profile <span class="cta-arrow">→</span>
            </button>
        </article>
        </section>

        <button
        class="fab"
        type="button"
        title="Create or update profile"
        @click="goToNewProfile"
        >
        +
        </button>

        <nav class="bottom-nav">
        <button class="nav-tab" type="button" @click="router.push('/')">
            <div class="nav-tab-ico">🏠</div>
            <span class="nav-tab-lbl">Home</span>
        </button>

        <button class="nav-tab active" type="button" @click="router.push('/directory')">
            <div class="nav-tab-ico">🔍</div>
            <span class="nav-tab-lbl">Discover</span>
        </button>

        <button class="nav-tab" type="button">
            <div class="nav-tab-ico">📝</div>
            <span class="nav-tab-lbl">Posts</span>
        </button>

        <button class="nav-tab" type="button">
            <div class="nav-tab-ico">💬</div>
            <span class="nav-tab-lbl">Messages</span>
        </button>

        <button class="nav-tab" type="button" @click="goToMyProfile">
            <div class="nav-tab-ico">👤</div>
            <span class="nav-tab-lbl">Profile</span>
        </button>
        </nav>
    </main>
</template>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

.directory-page {
    --bg: #0f172a;
    --card: #1e293b;
    --card-hover: #243350;
    --layer: #0d1525;
    --border: rgba(255, 255, 255, 0.07);
    --border-hi: rgba(255, 255, 255, 0.12);
    --purple: #6d28d9;
    --purple-md: #7c3aed;
    --purple-lt: #a78bfa;
    --blue: #3b82f6;
    --blue-lt: #93c5fd;
    --pink: #ec4899;
    --pink-lt: #f9a8d4;
    --green: #10b981;
    --green-lt: #6ee7b7;
    --tx-1: #f8fafc;
    --tx-2: #94a3b8;
    --tx-3: #64748b;
    --cat: var(--purple);
    --cat-lt: var(--purple-lt);
    --cat-soft: rgba(109, 40, 217, 0.12);
    min-height: 100vh;
    background: var(--bg);
    color: var(--tx-1);
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow-x: hidden;
    padding-bottom: 80px;
}

.nav-btn:hover {
  background: var(--card-hover);
  border-color: var(--border-hi);
}

.notif-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pink);
  border: 2px solid var(--bg);
}

.nav-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple), var(--pink));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.14);
  cursor: pointer;
}

.page-head {
  padding: 22px 20px 0;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.6px;
  line-height: 1.15;
  color: var(--tx-1);
}

.page-sub {
  font-size: 14px;
  color: var(--tx-2);
  margin-top: 4px;
}

.search-wrap {
  padding: 16px 20px 0;
}

.search-inner {
  position: relative;
}

.search-ico {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--tx-3);
  font-size: 15px;
  pointer-events: none;
}

.search-inp {
  width: 100%;
  height: 46px;
  padding: 0 42px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--tx-1);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-inp::placeholder {
  color: var(--tx-3);
}

.search-inp:focus {
  border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.18);
}

.filter-ico-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--cat-soft);
  border: none;
  color: var(--purple-lt);
  cursor: pointer;
}

.filters {
  padding: 14px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chip-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.chip-row::-webkit-scrollbar {
  display: none;
}

.chip {
  flex-shrink: 0;
  height: 32px;
  padding: 0 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--tx-2);
  transition: all 0.18s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
}

.chip:hover {
  border-color: var(--purple-md);
  color: var(--tx-1);
}

.chip.active-role {
  background: var(--purple);
  border-color: var(--purple);
  color: #fff;
  font-weight: 600;
}

.chip.active-loc {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
  font-weight: 600;
}

.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}

.results-bar {
  padding: 14px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.results-count {
  font-size: 13px;
  color: var(--tx-2);
}

.results-count strong {
  color: var(--tx-1);
  font-weight: 600;
}

.sort-btn {
  font-size: 12px;
  color: var(--purple-lt);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
}

.grid {
  padding: 12px 20px 110px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 18px 16px 21px;
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s, background 0.22s;
  position: relative;
  overflow: hidden;
  --cat: var(--purple);
  --cat-lt: var(--purple-lt);
  --cat-soft: rgba(109, 40, 217, 0.12);
}

.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--cat);
  border-radius: 3px 0 0 3px;
  transition: width 0.22s;
}

.card:hover {
  transform: translateY(-3px);
  background: var(--card-hover);
  border-color: rgba(255, 255, 255, 0.13);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px var(--cat),
    0 0 30px rgba(109, 40, 217, 0.12);
}

.card:hover::before {
  width: 4px;
}

.card.role-musician {
  --cat: var(--pink);
  --cat-lt: var(--pink-lt);
  --cat-soft: rgba(236, 72, 153, 0.12);
}

.card.role-creative-pro {
  --cat: var(--blue);
  --cat-lt: var(--blue-lt);
  --cat-soft: rgba(59, 130, 246, 0.12);
}

.card.role-brand {
  --cat: var(--green);
  --cat-lt: var(--green-lt);
  --cat-soft: rgba(16, 185, 129, 0.12);
}

.card.is-featured {
  border-color: var(--border-hi);
  box-shadow: 0 0 0 0.5px var(--border-hi);
}

.feat-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, var(--purple-md), var(--pink));
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 3px 9px;
  border-radius: 100px;
  text-transform: uppercase;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--cat), var(--purple-md));
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cat), transparent 60%);
  z-index: -1;
  opacity: 0.5;
}

.online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--green);
  border: 2px solid var(--card);
}

.name-block {
  flex: 1;
  min-width: 0;
}

.creator-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--tx-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.creator-handle {
  font-size: 12px;
  color: var(--tx-3);
  margin-top: 2px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: var(--cat-soft);
  color: var(--cat-lt);
  white-space: nowrap;
}

.location-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--tx-3);
}

.loc-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--tx-3);
}

.card-bio {
  font-size: 13px;
  color: var(--tx-2);
  line-height: 1.55;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
  min-height: 24px;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;
  background: var(--cat-soft);
  color: var(--cat-lt);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.card-cta {
  width: 100%;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--cat);
  background: var(--cat-soft);
  color: var(--cat-lt);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.card-cta:hover {
  background: var(--cat);
  color: #fff;
  box-shadow: 0 4px 14px rgba(109, 40, 217, 0.35);
}

.cta-arrow {
  font-size: 14px;
  transition: transform 0.2s;
}

.card-cta:hover .cta-arrow {
  transform: translateX(3px);
}

.empty-state {
  grid-column: 1 / -1;
  padding: 64px 20px;
  text-align: center;
}

.empty-ico {
  font-size: 42px;
  margin-bottom: 14px;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--tx-1);
  margin-bottom: 6px;
}

.empty-body {
  font-size: 14px;
  color: var(--tx-2);
}

.empty-clear {
  margin-top: 20px;
  padding: 10px 24px;
  border-radius: 100px;
  background: var(--purple);
  border: none;
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.fab {
  position: fixed;
  bottom: 86px;
  right: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple-md), var(--pink));
  border: none;
  color: #fff;
  font-size: 22px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 22px rgba(109, 40, 217, 0.55);
  transition: transform 0.22s, box-shadow 0.22s;
  z-index: 150;
}

.fab:hover {
  transform: scale(1.06) rotate(45deg);
  box-shadow: 0 6px 28px rgba(109, 40, 217, 0.7);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(13, 21, 37, 0.96);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px 4px;
  z-index: 180;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  cursor: pointer;
  padding: 6px 0;
  border-radius: 10px;
  transition: background 0.18s;
  background: transparent;
  border: none;
  font-family: inherit;
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.03);
}

.nav-tab-ico {
  font-size: 20px;
  color: var(--tx-3);
}

.nav-tab-lbl {
  font-size: 10px;
  font-weight: 500;
  color: var(--tx-3);
}

.nav-tab.active .nav-tab-ico,
.nav-tab.active .nav-tab-lbl {
  color: var(--purple-lt);
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>