import { useState, useEffect, useCallback } from 'react'
import { supabase, type Recommendation } from '../lib/supabase'
import FilterBar, { type Filter } from './FilterBar'
import RecommendationCard from './RecommendationCard'
import EditModal from './EditModal'

interface Props {
  currentUser: string
}

const LIKED_KEY = 'the-list-liked'

function getLiked(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveLiked(ids: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]))
}

export default function Feed({ currentUser }: Props) {
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [likedIds, setLikedIds] = useState<Set<string>>(getLiked)
  const [editing, setEditing] = useState<Recommendation | null>(null)

  const fetchRecs = useCallback(async () => {
    const { data } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setRecs(data as Recommendation[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRecs()

    const channel = supabase
      .channel('recommendations-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recommendations' },
        () => { fetchRecs() },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchRecs])

  async function handleLike(id: string) {
    const alreadyLiked = likedIds.has(id)
    const next = new Set(likedIds)
    const rec = recs.find((r) => r.id === id)
    if (!rec) return

    if (alreadyLiked) {
      next.delete(id)
      setLikedIds(next)
      saveLiked(next)
      setRecs((prev) =>
        prev.map((r) => r.id === id ? { ...r, likes: Math.max(0, r.likes - 1) } : r),
      )
      await supabase
        .from('recommendations')
        .update({ likes: Math.max(0, rec.likes - 1) })
        .eq('id', id)
    } else {
      next.add(id)
      setLikedIds(next)
      saveLiked(next)
      setRecs((prev) =>
        prev.map((r) => r.id === id ? { ...r, likes: r.likes + 1 } : r),
      )
      await supabase
        .from('recommendations')
        .update({ likes: rec.likes + 1 })
        .eq('id', id)
    }
  }

  const filtered = filter === 'all' ? recs : recs.filter((r) => r.category === filter)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 h-40 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <FilterBar active={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-stone-400">
          <p className="text-4xl mb-3">✦</p>
          <p className="text-sm">
            {filter === 'all'
              ? `nothing here yet — be the first to add something ✦`
              : `no ${filter} recs yet`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {filtered.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              isLiked={likedIds.has(rec.id)}
              onLike={handleLike}
              currentUser={currentUser}
              onEdit={setEditing}
            />
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          rec={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
