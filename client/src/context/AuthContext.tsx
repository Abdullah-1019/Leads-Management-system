import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authApi from '../services/api/auth.api'
import { clearStoredToken, getStoredToken, setStoredToken } from '../services/api/axiosClient'
import type { User } from '../types/auth'
import { AuthContext, type AuthContextValue } from './authContextInstance'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthContextValue['status']>(() =>
    getStoredToken() ? 'loading' : 'unauthenticated',
  )

  useEffect(() => {
    if (!getStoredToken()) return

    authApi
      .fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
        setStatus('authenticated')
      })
      .catch(() => {
        clearStoredToken()
        setStatus('unauthenticated')
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedInUser } = await authApi.login({ email, password })
    setStoredToken(token)
    setUser(loggedInUser)
    setStatus('authenticated')
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      clearStoredToken()
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
