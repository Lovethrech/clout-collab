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
    </div>
</template>