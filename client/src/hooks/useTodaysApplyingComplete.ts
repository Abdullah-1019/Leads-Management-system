import { useState } from 'react'
import { useAuth } from './useAuth'

function todayKey(userId: string) {
  const today = new Date().toISOString().slice(0, 10)
  return `companyCrm.todaysApplyingComplete.${userId}.${today}`
}

export function useTodaysApplyingComplete() {
  const { user } = useAuth()
  const key = user ? todayKey(user._id) : null

  const [isComplete, setIsComplete] = useState(() => (key ? localStorage.getItem(key) === '1' : false))

  function markComplete() {
    if (!key) return
    localStorage.setItem(key, '1')
    setIsComplete(true)
  }

  return { isComplete, markComplete }
}
