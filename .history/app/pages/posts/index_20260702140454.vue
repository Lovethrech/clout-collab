<script setup>
definePageMeta({
  layout: 'verified'
})

const router = useRouter()
const supabase = useSupabaseClient()

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const posts = ref([])
const activeFilter = ref('All')
const activeSort = ref('Latest First')
const showCreate = ref(false)

const filters = [
  'All',
  'Open',
  'Paid',
  'Unpaid',
  'Local',
  'International'
]

const sortOptions = [
  'Latest First',
  'Most Applied',
  'Paid Only'
]

const skills = [
  {
    label: '🎬 Videographer',
    value: 'Videographer'
  },
  {
    label: '📸 Photographer',
    value: 'Photographer'
  },
  {
    label: '✂️ Editor',
    value: 'Editor'
  },
  {
    label: '🎨 Designer',
    value: 'Designer'
  },
  {
    label: '🎵 Producer',
    value: 'Producer'
  },
  {
    label: '✍️ Writer',
    value: 'Writer'
  },
  {
    label: '🎤 Musician',
    value: 'Musician'
  },
  {
    label: '📱 Creator',
    value: 'Creator'
  },
  {
    label: '🎧 DJ',
    value: 'DJ'
  },
  {
    label: '🎞️ Animator',
    value: 'Animator'
  }
]

const form = reactive({
  title: '',
  description: '',
  skill_needed: '',
  location_type: 'Local',
  city: '',
  compensation_type: 'Paid'
})

const skillClassMap = {
  Videographer: 'skill-blue',
  Photographer: 'skill-violet',
  Editor: 'skill-pink',
  Designer: 'skill-green',
  Producer: 'skill-amber',
  Writer: 'skill-cyan',
  Musician: 'skill-pink',
  Creator: 'skill-purple',
  DJ: 'skill-orange',
  Animator: 'skill-teal'
}

const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error('You must be logged in.')
  }

  return data.user
}

const getCurrentProfile = async () => {
  const currentUser = await getCurrentUser()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single()

  if (error) {
    throw error
  }

  return data
}

const getPosts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase
      .from('collab_posts')
      .select(`
        *,
        profiles (
          id,
          name,
          role,
          profile_image,
          city,
          country,
          location
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    posts.value = data || []
  } catch (error) {
    errorMessage.value = error.message || 'Could not load collab posts.'
  } finally {
    loading.value = false
  }
}

const filteredPosts = computed(() => {
  let result = posts.value.filter((post) => {
    if (activeFilter.value === 'All') return true
    if (activeFilter.value === 'Open') return post.status === 'Open'
    if (activeFilter.value === 'Paid') return post.compensation_type === 'Paid'
    if (activeFilter.value === 'Unpaid') return post.compensation_type === 'Unpaid'
    if (activeFilter.value === 'Local') return post.location_type === 'Local'
    if (activeFilter.value === 'International') return post.location_type === 'International'
    return true
  })

  if (activeSort.value === 'Most Applied') {
    result = [...result].sort((a, b) => {
      return (b.applicant_count || 0) - (a.applicant_count || 0)
    })
  }

  if (activeSort.value === 'Paid Only') {
    result = result.filter((post) => {
      return post.compensation_type === 'Paid'
    })
  }

  return result
})

const isFormValid = computed(() => {
  return (
    form.title.trim().length >= 4 &&
    form.description.trim().length >= 10 &&
    form.skill_needed
  )
})

const descriptionCount = computed(() => {
  return form.description.length
})

const selectedSkillClass = computed(() => {
  return skillClassMap[form.skill_needed] || 'skill-blue'
})

const cycleSort = () => {
  const currentIndex = sortOptions.indexOf(activeSort.value)
  const nextIndex = currentIndex + 1 >= sortOptions.length ? 0 : currentIndex + 1
  activeSort.value = sortOptions[nextIndex]
}

const openCreate = () => {
  showCreate.value = true
  successMessage.value = ''
  errorMessage.value = ''
}

const closeCreate = () => {
  showCreate.value = false
  successMessage.value = ''
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.skill_needed = ''
  form.location_type = 'Local'
  form.city = ''
  form.compensation_type = 'Paid'
}

const createPost = async () => {
  if (!isFormValid.value) return

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const profile = await getCurrentProfile()

    const { error } = await supabase
      .from('collab_posts')
      .insert({
        profile_id: profile.id,
        title: form.title,
        description: form.description,
        skill_needed: form.skill_needed,
        location_type: form.location_type,
        city: form.city || profile.city || profile.location || 'Remote',
        compensation_type: form.compensation_type,
        status: 'Open',
        applicant_count: 0,
        updated_at: new Date().toISOString()
      })

    if (error) {
      throw error
    }

    successMessage.value = 'Collab posted successfully.'
    await getPosts()
    resetForm()
    showCreate.value = false
  } catch (error) {
    errorMessage.value = error.message || 'Could not create collab post.'
  } finally {
    saving.value = false
  }
}

const formatTime = (dateValue) => {
  if (!dateValue) return 'Just now'

  const date = new Date(dateValue)
  const now = new Date()
  const diffMs = now - date
  const diffHours = Math.floor(diffMs / 1000 / 60 / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
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

const getPosterName = (post) => {
  return post.profiles?.name || 'Clout User'
}

const getPosterInitials = (post) => {
  return getInitials(getPosterName(post))
}

const getLocationLabel = (post) => {
  if (post.location_type === 'International') return '✈️ Remote / International'
  if (post.location_type === 'Both') return '🌍 Local & International'
  return `📍 ${post.city || 'Local'}`
}

const getPreviewPost = computed(() => {
  return {
    title: form.title || 'Your post title will appear here',
    description:
      form.description ||
      "Your description will appear here — tell people what you're working on and what you need…",
    skill_needed: form.skill_needed || 'Skill needed',
    status: 'Open',
    compensation_type: form.compensation_type,
    location_type: form.location_type,
    city: form.location_type === 'Local' ? form.city || 'Local' : 'Remote',
    applicant_count: 0,
    created_at: new Date().toISOString(),
    profiles: {
      name: 'You',
      role: 'creator',
      profile_image: ''
    }
  }
})

const goToProfile = (profileId) => {
  if (!profileId) return
  router.push(`/profile/${profileId}`)
}

onMounted(() => {
  getPosts()
})
</script>

<template>
  <main class="posts-page" :class="{ 'show-create': showCreate }">
    <section v-if="!showCreate" class="pane feed-pane">
      <div class="feed-head">
        <h1 class="feed-title">Collab Requests</h1>
        <p class="feed-sub">Browse open collaboration opportunities</p>
      </div>

      <div class="filter-row">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          class="fchip"
          :class="{ on: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          <span v-if="filter === 'Open'">🟢</span>
          <span v-else-if="filter === 'Paid'">💰</span>
          <span v-else-if="filter === 'Unpaid'">🤝</span>
          <span v-else-if="filter === 'Local'">📍</span>
          <span v-else-if="filter === 'International'">✈️</span>
          {{ filter }}
        </button>
      </div>

      <div class="results-bar">
        <p class="results-count">
          <strong>{{ filteredPosts.length }}</strong>
          open collabs
        </p>

        <button class="sort-btn" type="button" @click="cycleSort">
          {{ activeSort }} ↓
        </button>
      </div>

      <div class="post-list">
        <div v-if="loading" class="feed-empty">
          <div class="feed-empty-ico">⏳</div>
          <div class="feed-empty-title">Loading collabs...</div>
          <p class="feed-empty-body">Fetching open collaboration opportunities.</p>
        </div>

        <div v-else-if="errorMessage" class="feed-empty">
          <div class="feed-empty-ico">⚠️</div>
          <div class="feed-empty-title">Something went wrong</div>
          <p class="feed-empty-body">{{ errorMessage }}</p>
        </div>

        <div v-else-if="!filteredPosts.length" class="feed-empty">
          <div class="feed-empty-ico">📭</div>
          <div class="feed-empty-title">No collabs match this filter</div>
          <p class="feed-empty-body">Try a different filter or check back later.</p>
        </div>

        <article
          v-for="post in filteredPosts"
          v-else
          :key="post.id"
          class="post-card"
          :class="skillClassMap[post.skill_needed] || 'skill-blue'"
        >
          <div class="card-header-row">
            <span class="skill-badge">
              {{ post.skill_needed }}
            </span>

            <span
              class="status-pill"
              :class="post.status === 'Open' ? 'open' : 'closed'"
            >
              <span class="status-dot"></span>
              {{ post.status }}
            </span>
          </div>

          <h2 class="post-title">
            {{ post.title }}
          </h2>

          <p class="post-desc">
            {{ post.description }}
          </p>

          <div class="poster-row">
            <button
              class="poster-ava"
              type="button"
              @click="goToProfile(post.profile_id)"
            >
              <img
                v-if="post.profiles?.profile_image"
                :src="post.profiles.profile_image"
                :alt="getPosterName(post)"
              />

              <span v-else>
                {{ getPosterInitials(post) }}
              </span>
            </button>

            <button
              class="poster-name"
              type="button"
              @click="goToProfile(post.profile_id)"
            >
              {{ getPosterName(post) }}
            </button>

            <span class="poster-sep">·</span>

            <span class="post-time">
              {{ formatTime(post.created_at) }}
            </span>

            <span class="post-applicants">
              {{ post.applicant_count || 0 }} applied
            </span>
          </div>

          <div class="meta-row">
            <span class="meta-chip">
              {{ getLocationLabel(post) }}
            </span>

            <span class="meta-chip">
              {{ post.compensation_type === 'Paid' ? '💰 Paid' : '🤝 Unpaid' }}
            </span>
          </div>

          <button class="apply-btn" type="button">
            Apply Now <span class="apply-arr">→</span>
          </button>
        </article>
      </div>

      <button
        class="floating-create-btn"
        type="button"
        @click="openCreate"
      >
        +
      </button>
    </section>

    <section v-else class="pane create-pane">
      <div class="create-top">
        <button class="back-btn" type="button" @click="closeCreate">
          ←
        </button>

        <h1>New Collab Post</h1>
      </div>

      <div class="create-scroll">
        <div class="fgroup">
          <label class="flabel">
            What are you looking for? <em>*</em>
          </label>

          <input
            v-model="form.title"
            class="finput"
            type="text"
            placeholder="e.g. Need a videographer for a fashion shoot"
            maxlength="80"
            autocomplete="off"
          />
        </div>

        <div class="fgroup">
          <label class="flabel">
            Describe the collaboration <em>*</em>
          </label>

          <div class="textarea-wrap">
            <textarea
              v-model="form.description"
              class="finput"
              rows="4"
              placeholder="What are you working on? What do you need from your collaborator? Share any useful details…"
              maxlength="280"
            />

            <span
              class="char-pill"
              :class="{
                warn: descriptionCount >= 220,
                over: descriptionCount >= 260
              }"
            >
              {{ descriptionCount }} / 280
            </span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="fgroup">
          <label class="flabel">
            Skill needed <em>*</em>
          </label>

          <div class="skill-grid">
            <button
              v-for="skill in skills"
              :key="skill.value"
              type="button"
              class="sk-opt"
              :class="[
                skillClassMap[skill.value] || 'skill-blue',
                { sel: form.skill_needed === skill.value }
              ]"
              @click="form.skill_needed = skill.value"
            >
              {{ skill.label }}
            </button>
          </div>
        </div>

        <div class="fgroup">
          <label class="flabel">Location preference</label>

          <div class="seg">
            <button
              type="button"
              class="seg-btn"
              :class="{ 'seg-on': form.location_type === 'Local' }"
              @click="form.location_type = 'Local'"
            >
              📍 Local
            </button>

            <button
              type="button"
              class="seg-btn"
              :class="{ 'seg-on seg-blue': form.location_type === 'International' }"
              @click="form.location_type = 'International'"
            >
              ✈️ International
            </button>

            <button
              type="button"
              class="seg-btn"
              :class="{ 'seg-on': form.location_type === 'Both' }"
              @click="form.location_type = 'Both'"
            >
              🌍 Both
            </button>
          </div>
        </div>

        <div v-if="form.location_type !== 'International'" class="fgroup">
          <label class="flabel">
            City
          </label>

          <input
            v-model="form.city"
            class="finput"
            type="text"
            placeholder="e.g. Lagos"
          />
        </div>

        <div class="fgroup">
          <label class="flabel">Compensation</label>

          <div class="seg">
            <button
              type="button"
              class="seg-btn"
              :class="{ 'seg-on': form.compensation_type === 'Paid' }"
              @click="form.compensation_type = 'Paid'"
            >
              💰 Paid
            </button>

            <button
              type="button"
              class="seg-btn"
              :class="{ 'seg-on seg-muted': form.compensation_type === 'Unpaid' }"
              @click="form.compensation_type = 'Unpaid'"
            >
              🤝 Unpaid
            </button>
          </div>
        </div>

        <div class="divider"></div>

        <div class="preview-wrap">
          <div class="preview-header">
            <span class="preview-label">Post preview</span>
            <span class="live-badge">● Live</span>
          </div>

          <article
            class="post-card preview-card"
            :class="selectedSkillClass"
          >
            <div class="card-header-row">
              <span class="skill-badge">
                {{ getPreviewPost.skill_needed }}
              </span>

              <span class="status-pill open">
                <span class="status-dot"></span>
                Open
              </span>
            </div>

            <h2 class="post-title">
              {{ getPreviewPost.title }}
            </h2>

            <p class="post-desc">
              {{ getPreviewPost.description }}
            </p>

            <div class="poster-row">
              <div class="poster-ava">
                YO
              </div>

              <span class="poster-name static-name">You</span>

              <span class="poster-sep">·</span>

              <span class="post-time">Just now</span>
            </div>

            <div class="meta-row">
              <span class="meta-chip">
                {{ getLocationLabel(getPreviewPost) }}
              </span>

              <span class="meta-chip">
                {{ form.compensation_type === 'Paid' ? '💰 Paid' : '🤝 Unpaid' }}
              </span>
            </div>

            <button class="apply-btn preview-apply" type="button">
              Apply Now →
            </button>
          </article>
        </div>

        <p v-if="errorMessage" class="form-error">
          {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="form-success">
          {{ successMessage }}
        </p>

        <button
          class="post-btn"
          type="button"
          :disabled="!isFormValid || saving"
          @click="createPost"
        >
          {{ saving ? 'Posting...' : 'Post Collab ✦' }}
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.posts-page {
  --bg: #0f172a;
  --bg-raised: #0d1525;
  --card: #1e293b;
  --card-hi: #243350;
  --border: rgba(255, 255, 255, 0.07);
  --border-hi: rgba(255, 255, 255, 0.13);

  --purple: #6d28d9;
  --purple-md: #7c3aed;
  --purple-lt: #a78bfa;
  --blue: #3b82f6;
  --blue-lt: #93c5fd;
  --pink: #ec4899;
  --pink-lt: #f9a8d4;
  --green: #10b981;
  --green-lt: #6ee7b7;
  --amber: #f59e0b;
  --amber-lt: #fcd34d;
  --cyan: #06b6d4;
  --cyan-lt: #67e8f9;
  --violet: #8b5cf6;
  --violet-lt: #c4b5fd;
  --orange: #f97316;
  --orange-lt: #fdba74;
  --teal: #14b8a6;
  --teal-lt: #5eead4;

  --tx-1: #f8fafc;
  --tx-2: #94a3b8;
  --tx-3: #64748b;
  --tx-4: #475569;

  --sk: var(--blue);
  --sk-lt: var(--blue-lt);
  --sk-sf: rgba(59, 130, 246, 0.12);

  min-height: calc(100vh - 60px);
  background: var(--bg);
  color: var(--tx-1);
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.pane {
    min-height: calc(100vh - 130px);
    padding-bottom: 90px;
}

.feed-head {
    padding: 22px 20px 0;
}

.feed-title {
    font-size: 3.6vh;
    font-weight: 800;
    letter-spacing: -0.6px;
    line-height: 1.15;
}

.feed-sub {
    font-size: 2vh;
    color: var(--tx-2);
    margin-top: 4px;
}

.filter-row {
  padding: 14px 20px 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-row::-webkit-scrollbar {
  display: none;
}

.fchip {
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

.fchip:hover {
  border-color: var(--purple-md);
  color: var(--tx-1);
}

.fchip.on {
  background: var(--purple);
  border-color: var(--purple);
  color: #fff;
  font-weight: 600;
}

.results-bar {
  padding: 13px 20px 0;
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
  font-weight: 500;
  color: var(--purple-lt);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.post-list {
  padding: 10px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 15px 15px 14px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s, background 0.22s;
  --sk: var(--blue);
  --sk-lt: var(--blue-lt);
  --sk-sf: rgba(59, 130, 246, 0.12);
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--sk) 0%, var(--sk-lt) 60%, transparent 100%);
}

.post-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: linear-gradient(180deg, var(--sk-sf) 0%, transparent 100%);
  pointer-events: none;
}

.post-card:hover {
  transform: translateY(-2px);
  background: var(--card-hi);
  border-color: var(--border-hi);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.32);
}

.skill-blue {
  --sk: var(--blue);
  --sk-lt: var(--blue-lt);
  --sk-sf: rgba(59, 130, 246, 0.12);
}

.skill-violet {
  --sk: var(--violet);
  --sk-lt: var(--violet-lt);
  --sk-sf: rgba(139, 92, 246, 0.12);
}

.skill-pink {
  --sk: var(--pink);
  --sk-lt: var(--pink-lt);
  --sk-sf: rgba(236, 72, 153, 0.12);
}

.skill-green {
  --sk: var(--green);
  --sk-lt: var(--green-lt);
  --sk-sf: rgba(16, 185, 129, 0.12);
}

.skill-amber {
  --sk: var(--amber);
  --sk-lt: var(--amber-lt);
  --sk-sf: rgba(245, 158, 11, 0.12);
}

.skill-cyan {
  --sk: var(--cyan);
  --sk-lt: var(--cyan-lt);
  --sk-sf: rgba(6, 182, 212, 0.12);
}

.skill-purple {
  --sk: var(--purple-md);
  --sk-lt: var(--purple-lt);
  --sk-sf: rgba(124, 58, 237, 0.12);
}

.skill-orange {
  --sk: var(--orange);
  --sk-lt: var(--orange-lt);
  --sk-sf: rgba(249, 115, 22, 0.12);
}

.skill-teal {
  --sk: var(--teal);
  --sk-lt: var(--teal-lt);
  --sk-sf: rgba(20, 184, 166, 0.12);
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
  position: relative;
  z-index: 1;
}

.skill-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 23px;
  padding: 0 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: var(--sk-sf);
  color: var(--sk-lt);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 9px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}

.status-pill.open {
  background: rgba(16, 185, 129, 0.12);
  color: var(--green-lt);
}

.status-pill.closed {
  background: rgba(100, 116, 139, 0.14);
  color: var(--tx-3);
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.post-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--tx-1);
  line-height: 1.38;
  margin-bottom: 6px;
  letter-spacing: -0.15px;
  position: relative;
  z-index: 1;
}

.post-desc {
  font-size: 13px;
  color: var(--tx-2);
  line-height: 1.56;
  margin-bottom: 11px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poster-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 11px;
}

.poster-ava {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--purple), var(--pink));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 0;
  overflow: hidden;
  cursor: pointer;
}

.poster-ava img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--tx-1);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
}

.static-name {
  cursor: default;
}

.poster-sep {
  font-size: 11px;
  color: var(--tx-4);
}

.post-time {
  font-size: 12px;
  color: var(--tx-3);
}

.post-applicants {
  font-size: 11px;
  color: var(--tx-3);
  margin-left: auto;
  flex-shrink: 0;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 13px;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 25px;
  padding: 0 9px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  color: var(--tx-2);
}

.apply-btn {
  width: 100%;
  height: 39px;
  border-radius: 12px;
  border: none;
  background: var(--sk);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.18s, transform 0.18s;
}

.apply-btn:hover {
  opacity: 0.88;
  transform: scale(0.99);
}

.preview-apply {
  opacity: 0.45;
  pointer-events: none;
}

.feed-empty {
  text-align: center;
  padding: 64px 24px;
}

.feed-empty-ico {
  font-size: 38px;
  margin-bottom: 14px;
}

.feed-empty-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}

.feed-empty-body {
  font-size: 14px;
  color: var(--tx-2);
}

.floating-create-btn {
  position: fixed;
  bottom: 86px;
  right: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple-md), var(--pink));
  border: none;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(109, 40, 217, 0.52);
  z-index: 50;
}

.create-pane {
  min-height: calc(100vh - 130px);
}

.create-top {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(13, 21, 37, 0.94);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
  height: 58px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
}

.back-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--tx-2);
  cursor: pointer;
}

.create-top h1 {
  font-size: 15px;
  font-weight: 700;
}

.create-scroll {
  padding: 20px 20px 24px;
}

.fgroup {
  margin-bottom: 20px;
}

.flabel {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--tx-2);
  margin-bottom: 8px;
}

.flabel em {
  font-style: normal;
  color: var(--purple-lt);
}

.finput {
  width: 100%;
  padding: 13px 14px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--tx-1);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  resize: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.finput::placeholder {
  color: var(--tx-3);
}

.finput:focus {
  border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.16);
}

.textarea-wrap {
  position: relative;
}

.char-pill {
  position: absolute;
  bottom: 10px;
  right: 11px;
  font-size: 11px;
  font-weight: 500;
  color: var(--tx-4);
  background: var(--card);
  padding: 1px 5px;
  border-radius: 4px;
}

.char-pill.warn {
  color: var(--amber);
}

.char-pill.over {
  color: var(--pink);
}

.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sk-opt {
  height: 34px;
  padding: 0 13px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--tx-2);
  transition: all 0.18s;
}

.sk-opt:hover {
  border-color: var(--purple-md);
  color: var(--tx-1);
}

.sk-opt.sel {
  border-color: var(--sk);
  background: var(--sk-sf);
  color: var(--sk-lt);
  font-weight: 600;
}

.seg {
  display: flex;
  gap: 0;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 4px;
}

.seg-btn {
  flex: 1;
  height: 36px;
  border-radius: 9px;
  border: none;
  background: none;
  color: var(--tx-3);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.seg-btn:hover {
  color: var(--tx-1);
}

.seg-btn.seg-on {
  background: var(--purple);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.32);
}

.seg-btn.seg-blue {
  background: var(--blue);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.32);
}

.seg-btn.seg-muted {
  background: rgba(100, 116, 139, 0.3);
  color: var(--tx-2);
  box-shadow: none;
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 22px 0;
}

.preview-wrap {
  margin-bottom: 22px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 11px;
}

.preview-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--tx-3);
}

.live-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 100px;
  background: rgba(16, 185, 129, 0.14);
  color: var(--green-lt);
}

.preview-card {
  cursor: default;
}

.post-btn {
  width: 100%;
  height: 50px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, var(--purple-md), var(--pink));
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(109, 40, 217, 0.42);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.post-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(109, 40, 217, 0.58);
}

.post-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  box-shadow: none;
}

.form-error {
  color: #fca5a5;
  font-size: 13px;
  margin-bottom: 14px;
}

.form-success {
  color: #6ee7b7;
  font-size: 13px;
  margin-bottom: 14px;
}

@media (min-width: 900px) {
  .post-list {
    max-width: 760px;
    margin: 0 auto;
  }

  .feed-head,
  .filter-row,
  .results-bar,
  .create-scroll {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>