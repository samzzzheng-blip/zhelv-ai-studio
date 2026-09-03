import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'
import { clearToken, getToken, setToken } from '@/api/http'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<authApi.CurrentUser | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const loading = ref(false)
  const authenticated = computed(() => Boolean(getToken()))

  async function signIn(payload: authApi.LoginPayload) {
    loading.value = true
    try {
      const result = await authApi.login(payload)
      setToken(result.token)
      await loadUser()
    } catch (error) {
      clearToken()
      throw error
    } finally {
      loading.value = false
    }
  }

  async function loadUser() {
    if (!getToken()) return null
    const result = await authApi.getUserInfo()
    user.value = result.user
    roles.value = result.roles
    permissions.value = result.permissions
    return result.user
  }

  async function signOut() {
    try { await authApi.logout() } catch { /* Local logout remains available when the server is offline. */ }
    clearToken()
    user.value = null
    roles.value = []
    permissions.value = []
  }

  return { user, roles, permissions, loading, authenticated, signIn, signOut, loadUser }
})
