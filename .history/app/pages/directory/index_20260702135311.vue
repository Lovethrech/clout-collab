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
    </main>
</template>

<style scoped>
<style scoped>
.directory-page {
  --cat: var(--cc-purple);
  --cat-lt: var(--cc-purple-lt);
  --cat-soft: rgba(109, 40, 217, 0.12);

  min-height: calc(100vh - 60px);
  background:
    radial-gradient(circle at top left, rgba(109, 40, 217, 0.16), transparent 34%),
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 32%),
    var(--cc-bg);
  color: var(--cc-text);
  font-family: var(--cc-font);
  padding-bottom: 96px;
}

.directory-shell {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

.directory-head {
  padding: 26px 20px 0;
}

.directory-title {
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.08;
}

.directory-sub {
  max-width: 520px;
  color: var(--cc-muted);
  font-size: 14px;
  line-height: 1.55;
  margin-top: 6px;
}

.search-wrap {
  padding: 18px 20px 0;
}

.search-inner {
  position: relative;
}

.search-ico {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cc-soft);
  font-size: 15px;
  pointer-events: none;
}

.search-inp {
  width: 100%;
  height: 48px;
  padding: 0 46px 0 44px;
  background: rgba(30, 41, 59, 0.86);
  border: 1px solid var(--cc-border);
  border-radius: 14px;
  color: var(--cc-text);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.16);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.search-inp::placeholder {
  color: var(--cc-soft);
}

.search-inp:focus {
  background: var(--cc-card);
  border-color: var(--cc-purple);
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.18),
    0 0 0 3px rgba(109, 40, 217, 0.18);
}

.filter-ico-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  width: 32px;
  height: 32px;
  transform: translateY(-50%);
  border: 0;
  border-radius: 10px;
  background: rgba(109, 40, 217, 0.14);
  color: var(--cc-purple-lt);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.filter-ico-btn:hover {
  background: rgba(109, 40, 217, 0.28);
  transform: translateY(-50%) rotate(12deg);
}

.filters {
  padding: 14px 20px 0;
  display: grid;
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
  flex: 0 0 auto;
  height: 34px;
  padding: 0 15px;
  border-radius: var(--cc-radius-chip);
  border: 1px solid var(--cc-border);
  background: rgba(30, 41, 59, 0.88);
  color: var(--cc-muted);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.chip:hover {
  color: var(--cc-text);
  border-color: rgba(167, 139, 250, 0.45);
  transform: translateY(-1px);
}

.chip.active-role {
  color: #fff;
  background: var(--cc-purple);
  border-color: var(--cc-purple);
}

.chip.active-loc {
  color: #fff;
  background: var(--cc-blue);
  border-color: var(--cc-blue);
}

.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.8;
}

.results-bar {
  padding: 16px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.results-count {
  color: var(--cc-muted);
  font-size: 13px;
}

.results-count strong {
  color: var(--cc-text);
  font-weight: 700;
}

.sort-btn {
  border: 0;
  background: transparent;
  color: var(--cc-purple-lt);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.sort-btn:hover {
  color: var(--cc-blue-lt);
}

.grid {
  padding: 14px 20px 110px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
  gap: 14px;
}

.card {
  --cat: var(--cc-purple);
  --cat-lt: var(--cc-purple-lt);
  --cat-soft: rgba(109, 40, 217, 0.12);

  position: relative;
  overflow: hidden;
  background: rgba(30, 41, 59, 0.94);
  border: 1px solid var(--cc-border);
  border-radius: 18px;
  padding: 18px 18px 16px 21px;
  cursor: pointer;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.16);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;
}

.card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--cat);
  transition: width 0.22s ease;
}

.card:hover {
  transform: translateY(-4px);
  background: var(--cc-card-hover);
  border-color: var(--cc-border-hi);
  box-shadow:
    0 20px 54px rgba(0, 0, 0, 0.34),
    0 0 0 1px var(--cat),
    0 0 34px rgba(109, 40, 217, 0.1);
}

.card:hover::before {
  width: 4px;
}

.card.role-musician {
  --cat: var(--cc-pink);
  --cat-lt: var(--cc-pink-lt);
  --cat-soft: rgba(236, 72, 153, 0.12);
}

.card.role-creative-pro {
  --cat: var(--cc-blue);
  --cat-lt: var(--cc-blue-lt);
  --cat-soft: rgba(59, 130, 246, 0.12);
}

.card.role-brand {
  --cat: var(--cc-green);
  --cat-lt: var(--cc-green-lt);
  --cat-soft: rgba(16, 185, 129, 0.12);
}

.card.is-featured {
  border-color: var(--cc-border-hi);
}

.feat-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  padding: 4px 9px;
  border-radius: var(--cc-radius-chip);
  background: linear-gradient(135deg, var(--cc-purple-md), var(--cc-pink));
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 13px;
  padding-right: 62px;
}

.avatar-wrap {
  position: relative;
  flex: 0 0 auto;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--cat), var(--cc-purple-md));
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  display: grid;
  place-items: center;
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
  background: linear-gradient(135deg, var(--cat), transparent 62%);
  z-index: -1;
  opacity: 0.6;
}

.online-dot {
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--cc-green);
  border: 2px solid var(--cc-card);
}

.name-block {
  min-width: 0;
  flex: 1;
}

.creator-name {
  color: var(--cc-text);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.creator-handle {
  margin-top: 3px;
  color: var(--cc-soft);
  font-size: 12px;
}

.card-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 11px;
}

.role-badge {
  height: 23px;
  padding: 0 10px;
  border-radius: var(--cc-radius-chip);
  background: var(--cat-soft);
  color: var(--cat-lt);
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
}

.location-pill {
  color: var(--cc-soft);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.loc-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.card-bio {
  min-height: 40px;
  color: var(--cc-muted);
  font-size: 13px;
  line-height: 1.55;
  margin-bottom: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 24px;
  margin-bottom: 15px;
}

.tag {
  height: 24px;
  padding: 0 10px;
  border-radius: var(--cc-radius-chip);
  background: var(--cat-soft);
  border: 1px solid rgba(255, 255, 255, 0.045);
  color: var(--cat-lt);
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}

.card-cta {
  width: 100%;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--cat);
  background: var(--cat-soft);
  color: var(--cat-lt);
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.card-cta:hover {
  background: var(--cat);
  color: #fff;
  box-shadow: 0 8px 18px rgba(109, 40, 217, 0.3);
}

.card-cta:hover .cta-arrow {
  transform: translateX(3px);
}

.cta-arrow {
  transition: transform 0.2s ease;
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
  color: var(--cc-text);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
}

.empty-body {
  color: var(--cc-muted);
  font-size: 14px;
  line-height: 1.55;
}

.empty-clear {
  margin-top: 20px;
  padding: 10px 24px;
  border: 0;
  border-radius: var(--cc-radius-chip);
  background: var(--cc-purple);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.empty-clear:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .directory-head,
  .search-wrap,
  .filters,
  .results-bar,
  .grid {
    padding-left: 16px;
    padding-right: 16px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .card-head {
    padding-right: 0;
  }

  .feat-badge {
    position: static;
    width: fit-content;
    margin: 0 0 10px auto;
    display: block;
  }
}

@media (min-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
