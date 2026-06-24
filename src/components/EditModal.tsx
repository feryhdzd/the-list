import { useState, useEffect, useRef } from 'react'
import { supabase, type Recommendation, type Category } from '../lib/supabase'

const categories: { value: Category; label: string }[] = [
  { value: 'recipe', label: 'recipe' },
  { value: 'music', label: 'music' },
  { value: 'book', label: 'book' },
  { value: 'link', label: 'link' },
  { value: 'list', label: 'list' },
  { value: 'other', label: 'other' },
]

interface Props {
  rec: Recommendation
  onClose: () => void
}

export default function EditModal({ rec, onClose }: Props) {
  const [title, setTitle] = useState(rec.title)
  const [category, setCategory] = useState<Category>(rec.category)
  const [url, setUrl] = useState(rec.url ?? '')
  const [note, setNote] = useState(rec.note ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    setError('')

    const { error: err } = await supabase
      .from('recommendations')
      .update({
        title: title.trim(),
        category,
        url: url.trim() || null,
        note: note.trim() || null,
      })
      .eq('id', rec.id)

    if (err) {
      setError('Something went wrong. Try again.')
      setSubmitting(false)
    } else {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-stone-800">edit</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              title <span className="text-rose-400">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] bg-white"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              url <span className="text-stone-300">(optional)</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] placeholder-stone-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              note <span className="text-stone-300">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] resize-none"
            />
            <p className="text-right text-xs text-stone-300 mt-0.5">{note.length}/200</p>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-stone-500 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || submitting}
              className="flex-1 py-2.5 text-sm font-medium text-white rounded-xl disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#7F77DD' }}
            >
              {submitting ? 'saving...' : 'save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
