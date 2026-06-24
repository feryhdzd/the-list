import type { Recommendation, Category } from '../lib/supabase'

const categoryColors: Record<Category, string> = {
  recipe: 'bg-teal-100 text-teal-700',
  music: 'bg-purple-100 text-purple-700',
  book: 'bg-amber-100 text-amber-700',
  link: 'bg-blue-100 text-blue-700',
  list: 'bg-rose-100 text-rose-700',
  other: 'bg-stone-100 text-stone-600',
}

interface Props {
  rec: Recommendation
  isLiked: boolean
  onLike: (id: string) => void
  currentUser: string
  onEdit: (rec: Recommendation) => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function RecommendationCard({ rec, isLiked, onLike, currentUser, onEdit }: Props) {
  const isOwner = rec.posted_by === currentUser

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-shadow">
      {/* Category tag + time */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[rec.category]}`}>
          {rec.category}
        </span>
        <span className="text-[11px] text-stone-400">{timeAgo(rec.created_at)}</span>
      </div>

      {/* Title */}
      <div>
        {rec.url ? (
          <a
            href={rec.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-stone-800 hover:text-[#7F77DD] transition-colors leading-snug line-clamp-2"
          >
            {rec.title}
          </a>
        ) : (
          <p className="font-semibold text-stone-800 leading-snug line-clamp-2">{rec.title}</p>
        )}
      </div>

      {/* Note */}
      {rec.note && (
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">{rec.note}</p>
      )}

      {/* URL chip */}
      {rec.url && (
        <a
          href={rec.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-400 truncate hover:text-stone-600 transition-colors"
        >
          {new URL(rec.url).hostname.replace(/^www\./, '')}
        </a>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">by {rec.posted_by}</span>
          {isOwner && (
            <button
              onClick={() => onEdit(rec)}
              className="text-xs text-stone-300 hover:text-[#7F77DD] transition-colors"
            >
              edit
            </button>
          )}
        </div>
        <button
          onClick={() => onLike(rec.id)}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
            isLiked
              ? 'bg-rose-50 text-rose-500'
              : 'text-stone-400 hover:text-rose-400 hover:bg-rose-50'
          }`}
        >
          <span>{isLiked ? '♥' : '♡'}</span>
          <span>{rec.likes}</span>
        </button>
      </div>
    </div>
  )
}
