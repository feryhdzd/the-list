import { useState, useEffect } from 'react'
import { supabase, type Member } from '../lib/supabase'

interface Props {
  onSelect: (name: string) => void
}

export default function NamePicker({ onSelect }: Props) {
  const [members, setMembers] = useState<Member[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('members')
      .select('*')
      .order('joined_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMembers(data)
        setLoading(false)
      })
  }, [])

  async function handleNewName() {
    const trimmed = newName.trim()
    if (!trimmed) return
    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase
      .from('members')
      .insert({ name: trimmed })

    if (insertError && insertError.code !== '23505') {
      // 23505 = unique violation (name already exists — treat as pick)
      setError('Something went wrong. Try again.')
      setSubmitting(false)
      return
    }

    onSelect(trimmed)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">
            the list <span style={{ color: '#7F77DD' }}>✦</span>
          </h1>
          <p className="text-stone-500 text-sm">a place for good things</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <p className="text-stone-700 font-medium mb-4">who are you?</p>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-stone-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : members.length > 0 ? (
            <>
              <div className="space-y-2 mb-4">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelect(m.name)}
                    className="w-full text-left px-4 py-2.5 rounded-xl border border-stone-200 hover:border-[#7F77DD] hover:bg-purple-50 text-stone-700 transition-colors text-sm font-medium"
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-stone-400">or add yourself</span>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNewName()}
              placeholder="your name"
              maxLength={40}
              className="flex-1 px-3 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] placeholder-stone-300"
            />
            <button
              onClick={handleNewName}
              disabled={!newName.trim() || submitting}
              className="px-4 py-2.5 text-sm font-medium text-white rounded-xl disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#7F77DD' }}
            >
              go
            </button>
          </div>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}
