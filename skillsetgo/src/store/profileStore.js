import { create } from 'zustand'

/**
 * Profile Store - Manages user profile data
 * Fetches and caches user profile from Firestore via API
 */
export const useProfileStore = create((set, get) => ({
  // State
  user: null,
  isLoading: false,
  error: null,

  // Actions
  fetchUserProfile: async (authToken) => {
    set({ isLoading: true, error: null })

    try {
      console.log('[profileStore] Fetching user profile...')
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch profile`)
      }

      const data = await response.json()
      console.log('[profileStore] Profile fetched successfully:', data.user)
      set({ user: data.user, isLoading: false })
      return data.user
    } catch (error) {
      const errorMsg = error?.message || String(error)
      console.error('[profileStore] Error fetching profile:', errorMsg)
      set({ error: errorMsg, isLoading: false })
      throw error
    }
  },

  // Getters
  getUserClass: () => {
    const state = get()
    return state.user?.class || null
  },

  getUserTier: () => {
    const state = get()
    return state.user?.tier || state.user?.purchasedTier || null
  },

  clearProfile: () =>
    set({
      user: null,
      isLoading: false,
      error: null,
    }),
}))
