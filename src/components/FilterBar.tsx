import type { Category } from '../lib/supabase'

export type Filter = 'all' | Category

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'recipe', label: 'recipes' },
  { value: 'music', label: 'music' },
  { value: 'book', label: 'books' },
  { value: 'link', label: 'links' },
  { value: 'list', label: 'lists' },
  { value: 'other', label: 'other' },
]

interface Props {
  active: Filter
  onChange: (f: Filter) => void
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
      {filters.map((f) => {
        const isActive = active === f.value
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? 'text-white'
                : 'text-stone-500 bg-stone-100 hover:bg-stone-200'
            }`}
            style={isActive ? { backgroundColor: '#7F77DD' } : {}}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
