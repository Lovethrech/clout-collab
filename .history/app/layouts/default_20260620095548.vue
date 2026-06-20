<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
}
</script>

<template>
    <div>
        <AppLogo/>
        <nav>
            
            <NuxtLink to="/">Home</NuxtLink>
                <button v-if="user" @click="handleLogout">Log out</button>
            <NuxtLink v-else to="/login">Log in</NuxtLink>
        </nav>
        <slot />
    </div>
</template>