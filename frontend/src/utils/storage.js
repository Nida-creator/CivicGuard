const STORAGE_KEY = 'civicguard_history'
const MAX_ENTRIES = 20

export const saveToHistory = (entry) => {
  try {
    const existing = getHistory()
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('en-PK', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      ...entry,
    }
    const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Storage save error:', e)
    return []
  }
}

export const getHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    return []
  }
}

export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {}
}

export const getStats = () => {
  const history = getHistory()
  return {
    total: history.length,
    phishing: history.filter(h => h.verdict === 'phishing').length,
    suspicious: history.filter(h => h.verdict === 'suspicious').length,
    safe: history.filter(h => h.verdict === 'safe').length,
  }
}
