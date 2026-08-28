import { usePOSStore } from '@/stores/useCartStore'
import { useProductStore } from '@/stores/useProductStore'
import { cn } from '@/lib/utils'
import {
  Grid,
  Coffee,
  Wine,
  GlassWater,
  CakeSlice,
  Cookie,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  grid: Grid,
  coffee: Coffee,
  wine: Wine,
  'glass-water': GlassWater,
  cake: CakeSlice,
  cookie: Cookie,
}

export default function CategoryTabs() {
  const { activeCategory, setActiveCategory } = usePOSStore()
  const categories = useProductStore((s) => s.categories)

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] || Grid
        const isActive = activeCategory === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap border shrink-0',
              isActive
                ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-accent/30 hover:text-accent hover:bg-accent/5'
            )}
          >
            <Icon className="w-4 h-4" />
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
