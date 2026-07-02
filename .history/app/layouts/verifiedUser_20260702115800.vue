<script setup>
const router = useRouter()
const user = useSupabaseUser()

const goToDirectory = () => {
    router.push('/directory')
}

const goToProfile = () => {
    if (user.value?.id) {
        router.push(`/profile/${user.value.id}`)
        return
    }

    router.push('/login')
}

const goToProfileNew = () => {
    router.push('/profile/new')
}

const getUserInitials = () => {
    if (!user.value?.email) return 'YO'

    return user.value.email.slice(0, 2).toUpperCase()
}
</script>

<template>
    <div class="verified-layout">
        <nav class="verified-top-nav">
            <span class="nav-logo" @click="goToDirectory">
                Clout Collabs
            </span>

            <div class="nav-actions">
                <button class="nav-btn" type="button" title="Notifications">
                🔔
                <span class="notif-dot"></span>
                </button>

                <button class="nav-btn" type="button" title="Messages">
                💬
                </button>

                <button class="nav-btn" type="button" title="News">
                📰
                </button>

                <button class="nav-avatar" type="button" @click="goToProfile">
                {{ getUserInitials() }}
                </button>
            </div>
            </nav>

            <main class="verified-main">
            <slot />
            </main>

            <button
            class="fab"
            type="button"
            title="Create or update profile"
            @click="goToProfileNew"
            >
            +
            </button>

            <nav class="bottom-nav">
            <button class="nav-tab" type="button" @click="router.push('/')">
                <div class="nav-tab-ico">🏠</div>
                <span class="nav-tab-lbl">Home</span>
            </button>

            <button class="nav-tab" type="button" @click="router.push('/directory')">
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

            <button class="nav-tab" type="button" @click="goToProfile">
                <div class="nav-tab-ico">👤</div>
                <span class="nav-tab-lbl">Profile</span>
            </button>
        </nav>
    </div>
</template>

<style scoped>
.verified-layout {
    --bg: #0f172a;
    --card: #1e293b;
    --card-hover: #243350;
    --layer: #0d1525;
    --border: rgba(255, 255, 255, 0.07);
    --border-hi: rgba(255, 255, 255, 0.12);
    --purple: #6d28d9;
    --purple-md: #7c3aed;
    --purple-lt: #a78bfa;
    --blue-lt: #93c5fd;
    --pink: #ec4899;
    --tx-1: #f8fafc;
    --tx-2: #94a3b8;
    --tx-3: #64748b;

    min-height: 100vh;
    background: var(--bg);
    color: var(--tx-1);
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding-bottom: 80px;
}

.verified-top-nav {
    position: sticky;
    top: 0;
    z-index: 200;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    height: 60px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.nav-logo {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.4px;
    background: linear-gradient(135deg, var(--purple-lt) 0%, var(--blue-lt) 100%);
    background-clip: text;
    color: transparent;
    white-space: nowrap;
    cursor: pointer;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--card);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--tx-2);
    font-size: 15px;
    transition: background 0.18s, border-color 0.18s;
    position: relative;
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

.verified-main {
    min-height: calc(100vh - 60px);
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

.nav-tab:hover .nav-tab-ico,
.nav-tab:hover .nav-tab-lbl {
    color: var(--purple-lt);
}

@media (max-width: 520px) {
    .nav-actions {
        gap: 7px;
    }

    .nav-btn {
        width: 33px;
        height: 33px;
    }

    .nav-avatar {
        width: 32px;
        height: 32px;
    }
}
</style>