import { useState, useEffect } from 'react'
import NamePicker from './components/NamePicker'
import Feed from './components/Feed'
import AddModal from './components/AddModal'

export default function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('the-list-name')
    if (saved) setUserName(saved)
  }, [])

  if (!userName) {
    return (
      <NamePicker
        onSelect={(name) => {
          localStorage.setItem('the-list-name', name)
          setUserName(name)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight text-stone-800">
            🌿 Jardín Digital
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-400 hidden sm:block">
              👋 hola, {userName}
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-sm font-medium px-4 py-1.5 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#7F77DD' }}
            >
              ✨ agregar algo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Feed currentUser={userName} />
      </main>

      {showAddModal && (
        <AddModal
          currentUser={userName}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
