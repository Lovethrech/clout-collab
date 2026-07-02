export const useProfile = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const getMyProfile = async () => {
        if (!user.value) return null

        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

        if (error && error.code !== 'PGRST116') {
        throw error
        }

        return data
    }

    const getProfileById = async (id) => {
        const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            portfolio_items (*)
        `)
        .eq('id', id)
        .single()

        if (error) throw error

        return data
    }

    const upsertMyProfile = async (payload) => {
        if (!user.value) {
        throw new Error('You must be logged in to create a profile.')
        }

        const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: user.value.id,
            ...payload,
            updated_at: new Date().toISOString()
        })
        .select()
        .single()

        if (error) throw error

        return data
    }

    return {
        getMyProfile,
        getProfileById,
        upsertMyProfile
    }
}