<script setup>
const route = useRoute()
const { getProfileById } = useProfile()

const profile = ref(null)
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    profile.value = await getProfileById(route.params.id)
  } catch (error) {
    errorMessage.value = error.message || 'Profile not found.'
  } finally {
    loading.value = false
  }
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
      <div class="cover"></div>

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

        <div class="name-row">
          <h1>{{ profile.name }}</h1>
        </div>

        <p class="role-line">
          {{ profile.role }}
          <span v-if="profile.location"> · {{ profile.location }}</span>
        </p>

        <p v-if="profile.bio" class="bio">
          {{ profile.bio }}
        </p>
      </div>

      <div class="stats-row">
        <div>
          <strong>0</strong>
          <span>Views</span>
        </div>

        <div>
          <strong>
            {{ profile.portfolio_projects ? profile.portfolio_projects.length : 0 }}
          </strong>
          <span>Projects</span>
        </div>

        <div>
          <strong>0.0</strong>
          <span>Rating</span>
        </div>
      </div>

      <div v-if="profile.niche && profile.niche.length" class="tag-row">
        <span v-for="item in profile.niche" :key="item">
          {{ item }}
        </span>
      </div>

      <div v-if="profile.skills && profile.skills.length" class="tag-row skills-row">
        <span v-for="skill in profile.skills" :key="skill">
          {{ skill }}
        </span>
      </div>

      <div class="social-row">
        <a
          v-if="profile.social_links?.instagram"
          :href="profile.social_links.instagram"
          target="_blank"
        >
          Instagram
        </a>

        <a
          v-if="profile.social_links?.tiktok"
          :href="profile.social_links.tiktok"
          target="_blank"
        >
          TikTok
        </a>

        <a
          v-if="profile.social_links?.youtube"
          :href="profile.social_links.youtube"
          target="_blank"
        >
          YouTube
        </a>

        <a
          v-if="profile.social_links?.website"
          :href="profile.social_links.website"
          target="_blank"
        >
          Website
        </a>
      </div>

      <div class="portfolio-section">
        <div class="portfolio-head">
          <h2>Portfolio</h2>

          <span v-if="profile.portfolio_projects?.length">
            See all ({{ profile.portfolio_projects.length }}) →
          </span>
        </div>

        <div v-if="profile.portfolio_projects?.length" class="portfolio-grid">
          <article
            v-for="project in profile.portfolio_projects"
            :key="project.title"
            class="portfolio-card"
          >
            <div class="portfolio-thumb">
              <span>{{ project.category || 'Project' }}</span>
            </div>

            <div class="portfolio-body">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
            </div>
          </article>
        </div>

        <p v-else class="empty">
          No portfolio projects yet.
        </p>
      </div>

      <div class="profile-cta">
        <button>Message</button>
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
  padding: 24px 14px;
}

.profile-shell {
  width: 100%;
  max-width: 430px;
  background: #0b1322;
  border: 1px solid #2a3b55;
  border-radius: 28px;
  overflow: hidden;
}

.cover {
  height: 140px;
  background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 52%, #ec4899 100%);
}

.profile-head {
  position: relative;
  padding: 0 20px 20px;
}

.avatar {
  width: 84px;
  height: 84px;
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

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}

h1 {
  font-family: 'Unbounded', sans-serif;
  font-size: 22px;
}

.role-line {
  color: #94a3b8;
  margin-top: 4px;
  font-size: 14px;
  text-transform: capitalize;
}

.bio {
  color: #e2e8f0;
  margin-top: 14px;
  line-height: 1.6;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #1e293b;
  border-bottom: 1px solid #1e293b;
  margin: 0 20px 16px;
  padding: 14px 0;
}

.stats-row div {
  text-align: center;
  border-right: 1px solid #1e293b;
}

.stats-row div:last-child {
  border-right: 0;
}

.stats-row strong {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  color: #f9a8d4;
}

.stats-row span {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
  text-transform: uppercase;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 20px;
  margin-bottom: 10px;
}

.tag-row span {
  color: #c4b5fd;
  background: rgba(139, 92, 246, 0.14);
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 12px;
}

.skills-row span {
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.14);
  border-color: rgba(59, 130, 246, 0.3);
}

.social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 20px 0;
}

.social-row a {
  color: #f8fafc;
  text-decoration: none;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 999px;
  padding: 7px 11px;
  font-size: 12px;
}

.portfolio-section {
  padding: 20px;
}

.portfolio-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.portfolio-head h2 {
  font-family: 'Unbounded', sans-serif;
  font-size: 16px;
}

.portfolio-head span {
  color: #93c5fd;
  font-size: 12px;
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
  height: 150px;
  position: relative;
  background: linear-gradient(135deg, #6d28d9, #3b82f6);
}

.portfolio-thumb span {
  position: absolute;
  left: 14px;
  bottom: 14px;
  font-size: 10px;
  text-transform: uppercase;
  background: rgba(15, 23, 42, 0.55);
  padding: 5px 10px;
  border-radius: 999px;
}

.portfolio-body {
  padding: 16px;
}

.portfolio-body h3 {
  font-family: 'Unbounded', sans-serif;
  font-size: 14px;
  margin-bottom: 8px;
}

.portfolio-body p,
.empty {
  color: #94a3b8;
  font-size: 12px;
}

.profile-cta {
  position: sticky;
  bottom: 0;
  padding: 14px 20px 18px;
  background: #0b1322;
  border-top: 1px solid #1e293b;
}

button {
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 14px;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 52%, #ec4899 100%);
}

.state {
  color: #94a3b8;
  padding-top: 80px;
}

.error {
  color: #ef4444;
}
</style>