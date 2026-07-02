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

const filters = ['All', 'Open', 'Paid', 'Unpaid', 'Local', 'International']

const sortOptions = ['Latest First', 'Most Applied', 'Paid Only']

const skills = [
  { label: '🎬 Videographer', value: 'Videographer' },
  { label: '📸 Photographer', value: 'Photographer' },
  { label: '✂️ Editor', value: 'Editor' },
  { label: '🎨 Designer', value: 'Designer' },
  { label: '🎵 Producer', value: 'Producer' },
  { label: '✍️ Writer', value: 'Writer' },
  { label: '🎤 Musician', value: 'Musician' },
  { label: '📱 Creator', value: 'Creator' },
  { label: '🎧 DJ', value: 'DJ' },
  { label: '🎞️ Animator', value: 'Animator' }
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

  if (error) throw error

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

  if (error) throw error

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

    if (error) throw error

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

const previewPost = computed(() => {
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
    profile_id: null,
    profiles: {
      name: 'You',
      role: 'creator',
      profile_image: ''
    }
  }
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const closeCreate = () => {
  showCreate.value = false
  successMessage.value = ''
  errorMessage.value = ''
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

    if (error) throw error

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

const goToProfile = (profileId) => {
  if (!profileId) return
  router.push(`/profile/${profileId}`)
}

onMounted(() => {
  getPosts()
})
</script>

<template>
  <main class="posts-page">
    <div class="posts-shell">
      <section v-if="!showCreate" class="feed-pane">
        <div class="posts-head">
          <h1 class="posts-title">Collab Requests</h1>
          <p class="posts-sub">Browse open collaboration opportunities</p>
        </div>

        <div class="filter-row">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            class="filter-chip"
            :class="{ active: activeFilter === filter }"
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
            {{ filteredPosts.length === 1 ? 'open collab' : 'open collabs' }}
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
                class="poster-avatar"
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

              <span class="poster-separator">·</span>

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
              Apply Now <span class="apply-arrow">→</span>
            </button>
          </article>
        </div>

        <button
          class="post-fab"
          type="button"
          aria-label="Create collab post"
          @click="openCreate"
        >
          +
        </button>
      </section>

      <section v-else class="create-pane">
        <div class="create-top">
          <button class="back-btn" type="button" @click="closeCreate">
            ←
          </button>

          <div>
            <h1>New Collab Post</h1>
            <p>Create an opportunity collaborators can apply to.</p>
          </div>
        </div>

        <div class="create-scroll">
          <div class="form-group">
            <label class="form-label">
              What are you looking for? <em>*</em>
            </label>

            <input
              v-model="form.title"
              class="form-input"
              type="text"
              placeholder="e.g. Need a videographer for a fashion shoot"
              maxlength="80"
              autocomplete="off"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Describe the collaboration <em>*</em>
            </label>

            <div class="textarea-wrap">
              <textarea
                v-model="form.description"
                class="form-input"
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

          <div class="form-group">
            <label class="form-label">
              Skill needed <em>*</em>
            </label>

            <div class="skill-grid">
              <button
                v-for="skill in skills"
                :key="skill.value"
                type="button"
                class="skill-option"
                :class="[
                  skillClassMap[skill.value] || 'skill-blue',
                  { selected: form.skill_needed === skill.value }
                ]"
                @click="form.skill_needed = skill.value"
              >
                {{ skill.label }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Location preference</label>

            <div class="segment">
              <button
                type="button"
                class="segment-btn"
                :class="{ active: form.location_type === 'Local' }"
                @click="form.location_type = 'Local'"
              >
                📍 Local
              </button>

              <button
                type="button"
                class="segment-btn"
                :class="{ active: form.location_type === 'International' }"
                @click="form.location_type = 'International'"
              >
                ✈️ International
              </button>

              <button
                type="button"
                class="segment-btn"
                :class="{ active: form.location_type === 'Both' }"
                @click="form.location_type = 'Both'"
              >
                🌍 Both
              </button>
            </div>
          </div>

          <div v-if="form.location_type !== 'International'" class="form-group">
            <label class="form-label">City</label>

            <input
              v-model="form.city"
              class="form-input"
              type="text"
              placeholder="e.g. Lagos"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Compensation</label>

            <div class="segment two">
              <button
                type="button"
                class="segment-btn"
                :class="{ active: form.compensation_type === 'Paid' }"
                @click="form.compensation_type = 'Paid'"
              >
                💰 Paid
              </button>

              <button
                type="button"
                class="segment-btn muted"
                :class="{ active: form.compensation_type === 'Unpaid' }"
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
                  {{ previewPost.skill_needed }}
                </span>

                <span class="status-pill open">
                  <span class="status-dot"></span>
                  Open
                </span>
              </div>

              <h2 class="post-title">
                {{ previewPost.title }}
              </h2>

              <p class="post-desc">
                {{ previewPost.description }}
              </p>

              <div class="poster-row">
                <div class="poster-avatar static-avatar">
                  YO
                </div>

                <span class="poster-name static-name">You</span>

                <span class="poster-separator">·</span>

                <span class="post-time">Just now</span>
              </div>

              <div class="meta-row">
                <span class="meta-chip">
                  {{ getLocationLabel(previewPost) }}
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
            class="submit-btn"
            type="button"
            :disabled="!isFormValid || saving"
            @click="createPost"
          >
            {{ saving ? 'Posting...' : 'Post Collab ✦' }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.posts-page {
  min-height: calc(100vh - 60px);
  background:
    radial-gradient(circle at top left, rgba(124, 58, 237, 0.14), transparent 34%),
    radial-gradient(circle at top right, rgba(236, 72, 153, 0.1), transparent 30%),
    var(--cc-bg);
  color: var(--cc-text);
  font-family: var(--cc-font);
  padding-bottom: 96px;
}

.posts-shell {
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
}

.posts-head {
  padding: 26px 20px 0;
}

.posts-title {
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.08;
}

.posts-sub {
  max-width: 520px;
  color: var(--cc-muted);
  font-size: 14px;
  line-height: 1.55;
  margin-top: 6px;
}

.filter-row {
  padding: 16px 20px 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-row::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  flex: 0 0 auto;
  height: 34px;
  padding: 0 15px;
  border-radius: var(--cc-radius-chip);
  border: 1px solid var(--cc-border);
  background: rgba(30, 41, 59, 0.88);
  color: var(--cc-muted);
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.filter-chip:hover {
  color: var(--cc-text);
  border-color: rgba(167, 139, 250, 0.45);
  transform: translateY(-1px);
}

.filter-chip.active {
  color: #fff;
  background: var(--cc-purple);
  border-color: var(--cc-purple);
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
  font-weight: 800;
}

.sort-btn {
  border: 0;
  background: transparent;
  color: var(--cc-purple-lt);
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.sort-btn:hover {
  color: var(--cc-blue-lt);
}

.post-list {
  padding: 14px 20px 110px;
  display: grid;
  gap: 14px;
}

.post-card {
  --sk: var(--cc-blue);
  --sk-lt: var(--cc-blue-lt);
  --sk-soft: rgba(59, 130, 246, 0.12);

  position: relative;
  overflow: hidden;
  background: rgba(30, 41, 59, 0.94);
  border: 1px solid var(--cc-border);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.16);
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.post-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--sk), var(--sk-lt) 62%, transparent);
}

.post-card::after {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 62px;
  background: linear-gradient(180deg, var(--sk-soft), transparent);
  pointer-events: none;
}

.post-card:hover {
  transform: translateY(-3px);
  background: var(--cc-card-hover);
  border-color: var(--cc-border-hi);
  box-shadow: 0 20px 54px rgba(0, 0, 0, 0.32);
}

.skill-blue {
  --sk: var(--cc-blue);
  --sk-lt: var(--cc-blue-lt);
  --sk-soft: rgba(59, 130, 246, 0.12);
}

.skill-violet {
  --sk: var(--cc-violet);
  --sk-lt: var(--cc-violet-lt);
  --sk-soft: rgba(139, 92, 246, 0.12);
}

.skill-pink {
  --sk: var(--cc-pink);
  --sk-lt: var(--cc-pink-lt);
  --sk-soft: rgba(236, 72, 153, 0.12);
}

.skill-green {
  --sk: var(--cc-green);
  --sk-lt: var(--cc-green-lt);
  --sk-soft: rgba(16, 185, 129, 0.12);
}

.skill-amber {
  --sk: var(--cc-amber);
  --sk-lt: var(--cc-amber-lt);
  --sk-soft: rgba(245, 158, 11, 0.12);
}

.skill-cyan {
  --sk: var(--cc-cyan);
  --sk-lt: var(--cc-cyan-lt);
  --sk-soft: rgba(6, 182, 212, 0.12);
}

.skill-purple {
  --sk: var(--cc-purple-md);
  --sk-lt: var(--cc-purple-lt);
  --sk-soft: rgba(124, 58, 237, 0.12);
}

.skill-orange {
  --sk: var(--cc-orange);
  --sk-lt: var(--cc-orange-lt);
  --sk-soft: rgba(249, 115, 22, 0.12);
}

.skill-teal {
  --sk: var(--cc-teal);
  --sk-lt: var(--cc-teal-lt);
  --sk-soft: rgba(20, 184, 166, 0.12);
}

.card-header-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.skill-badge {
  min-width: 0;
  max-width: 70%;
  height: 24px;
  padding: 0 10px;
  border-radius: var(--cc-radius-chip);
  background: var(--sk-soft);
  color: var(--sk-lt);
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-pill {
  height: 23px;
  padding: 0 9px;
  border-radius: var(--cc-radius-chip);
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-pill.open {
  background: rgba(16, 185, 129, 0.12);
  color: var(--cc-green-lt);
}

.status-pill.closed {
  background: rgba(100, 116, 139, 0.16);
  color: var(--cc-soft);
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.post-title {
  position: relative;
  z-index: 1;
  color: var(--cc-text);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.18px;
  margin-bottom: 7px;
}

.post-desc {
  color: var(--cc-muted);
  font-size: 13px;
  line-height: 1.58;
  margin-bottom: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poster-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
}

.poster-avatar {
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--cc-purple), var(--cc-pink));
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex: 0 0 auto;
}

.poster-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-name {
  border: 0;
  background: transparent;
  color: var(--cc-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  padding: 0;
  cursor: pointer;
}

.static-name {
  cursor: default;
}

.poster-separator {
  color: var(--cc-dim);
  font-size: 11px;
}

.post-time {
  color: var(--cc-soft);
  font-size: 12px;
}

.post-applicants {
  margin-left: auto;
  color: var(--cc-soft);
  font-size: 11px;
  white-space: nowrap;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 13px;
}

.meta-chip {
  height: 26px;
  padding: 0 10px;
  border-radius: var(--cc-radius-chip);
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid var(--cc-border);
  color: var(--cc-muted);
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}

.apply-btn {
  width: 100%;
  height: 40px;
  border: 0;
  border-radius: 13px;
  background: var(--sk);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.apply-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.22);
}

.apply-btn:hover .apply-arrow {
  transform: translateX(3px);
}

.apply-arrow {
  transition: transform 0.2s ease;
}

.feed-empty {
  padding: 64px 24px;
  text-align: center;
  color: var(--cc-muted);
}

.feed-empty-ico {
  font-size: 38px;
  margin-bottom: 14px;
}

.feed-empty-title {
  color: var(--cc-text);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
}

.feed-empty-body {
  color: var(--cc-muted);
  font-size: 14px;
  line-height: 1.55;
}

.post-fab {
  position: fixed;
  right: 20px;
  bottom: 86px;
  z-index: 80;
  width: 54px;
  height: 54px;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cc-purple-md), var(--cc-pink));
  color: #fff;
  font-size: 25px;
  font-weight: 400;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 28px rgba(109, 40, 217, 0.48);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.post-fab:hover {
  transform: scale(1.06) rotate(90deg);
  box-shadow: 0 14px 34px rgba(109, 40, 217, 0.64);
}

.create-pane {
  padding-bottom: 100px;
}

.create-top {
  position: sticky;
  top: 0;
  z-index: 40;
  min-height: 64px;
  padding: 12px 20px;
  background: rgba(13, 21, 37, 0.94);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--cc-border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--cc-border);
  background: var(--cc-card);
  color: var(--cc-muted);
  cursor: pointer;
  flex: 0 0 auto;
}

.back-btn:hover {
  background: var(--cc-card-hover);
  color: var(--cc-text);
}

.create-top h1 {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.create-top p {
  color: var(--cc-muted);
  font-size: 12px;
  margin-top: 2px;
}

.create-scroll {
  padding: 22px 20px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  color: var(--cc-muted);
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 8px;
}

.form-label em {
  color: var(--cc-purple-lt);
  font-style: normal;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--cc-border);
  border-radius: 14px;
  background: rgba(30, 41, 59, 0.92);
  color: var(--cc-text);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  resize: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.form-input::placeholder {
  color: var(--cc-soft);
}

.form-input:focus {
  background: var(--cc-card);
  border-color: var(--cc-purple);
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.16);
}

.textarea-wrap {
  position: relative;
}

.char-pill {
  position: absolute;
  right: 11px;
  bottom: 10px;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--cc-card);
  color: var(--cc-dim);
  font-size: 11px;
  font-weight: 800;
}

.char-pill.warn {
  color: var(--cc-amber);
}

.char-pill.over {
  color: var(--cc-pink);
}

.divider {
  height: 1px;
  background: var(--cc-border);
  margin: 22px 0;
}

.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-option {
  --sk: var(--cc-blue);
  --sk-lt: var(--cc-blue-lt);
  --sk-soft: rgba(59, 130, 246, 0.12);

  height: 35px;
  padding: 0 13px;
  border-radius: var(--cc-radius-chip);
  border: 1px solid var(--cc-border);
  background: rgba(30, 41, 59, 0.9);
  color: var(--cc-muted);
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.skill-option:hover {
  color: var(--cc-text);
  border-color: var(--sk);
  transform: translateY(-1px);
}

.skill-option.selected {
  border-color: var(--sk);
  background: var(--sk-soft);
  color: var(--sk-lt);
}

.segment {
  padding: 4px;
  border: 1px solid var(--cc-border);
  border-radius: 14px;
  background: rgba(30, 41, 59, 0.86);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.segment.two {
  grid-template-columns: repeat(2, 1fr);
}

.segment-btn {
  height: 38px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: var(--cc-soft);
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.segment-btn:hover {
  color: var(--cc-text);
}

.segment-btn.active {
  background: var(--cc-purple);
  color: #fff;
  box-shadow: 0 6px 16px rgba(109, 40, 217, 0.24);
}

.segment-btn.muted.active {
  background: rgba(100, 116, 139, 0.3);
  color: var(--cc-text);
  box-shadow: none;
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
  color: var(--cc-soft);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.live-badge {
  padding: 3px 8px;
  border-radius: var(--cc-radius-chip);
  background: rgba(16, 185, 129, 0.14);
  color: var(--cc-green-lt);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.preview-card {
  cursor: default;
}

.preview-card:hover {
  transform: none;
}

.preview-apply {
  opacity: 0.46;
  pointer-events: none;
}

.static-avatar,
.static-name {
  cursor: default;
}

.form-error,
.form-success {
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 700;
}

.form-error {
  color: #fca5a5;
}

.form-success {
  color: var(--cc-green-lt);
}

.submit-btn {
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 15px;
  background: linear-gradient(135deg, var(--cc-purple-md), var(--cc-pink));
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(109, 40, 217, 0.34);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(109, 40, 217, 0.48);
}

.submit-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 640px) {
  .posts-head,
  .filter-row,
  .results-bar,
  .post-list,
  .create-scroll,
  .create-top {
    padding-left: 16px;
    padding-right: 16px;
  }

  .post-applicants {
    display: none;
  }

  .segment {
    grid-template-columns: 1fr;
  }

  .segment.two {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 900px) {
  .post-list,
  .posts-head,
  .filter-row,
  .results-bar,
  .create-scroll {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>