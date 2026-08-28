import { useState, useEffect } from 'react'
import { useProductStore } from '@/stores/useProductStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus, Upload, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  editProduct?: Product | null
}

const sizeOptions = ['cold', 'hot', 'large', 'medium', 'small', 'special', 'half', 'full']

export default function AddProductModal({ open, onClose, editProduct }: AddProductModalProps) {
  const { addProduct, updateProduct, addCategory, categories } = useProductStore()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [stock, setStock] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name)
      setPrice(String(editProduct.price))
      setCategory(editProduct.category)
      setImage(editProduct.image || '')
      setDescription(editProduct.description || '')
      setSelectedSizes(editProduct.sizes || [])
      setStock(editProduct.stock !== undefined ? String(editProduct.stock) : '')
    } else {
      setName('')
      setPrice('')
      setCategory(categories[0]?.id || '')
      setImage('')
      setDescription('')
      setSelectedSizes([])
      setStock('')
    }
    setShowNewCategory(false)
    setNewCategoryName('')
  }, [editProduct, open])

  const handleAddNewCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    addCategory(name)
    const id = name.toLowerCase().replace(/\s+/g, '-')
    setCategory(id)
    setShowNewCategory(false)
    setNewCategoryName('')
  }

  if (!open) return null

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Product name is required'
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) errs.price = 'Enter a valid price'
    if (!category) errs.category = 'Select a category'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    let catId = category
    if (catId && !categories.find((c) => c.id === catId)) {
      await addCategory(catId)
    }
    const data = {
      name: name.trim(),
      price: parseFloat(price),
      category: catId,
      image: image || '',
      description: description.trim(),
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      stock: stock ? parseInt(stock) : 0,
    }
    if (editProduct) {
      updateProduct(editProduct.id, data)
    } else {
      addProduct({ ...data, available: true })
    }
    setName('')
    setPrice('')
    setCategory(categories[0]?.id || '')
    setImage('')
    setDescription('')
    setSelectedSizes([])
    setStock('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
              <Plus className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors rounded-xl">
                <span className="sr-only">Upload image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Product Name</label>
              <Input
                placeholder="e.g. Iced Mocha"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })) }}
                required
                autoFocus
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Price ($)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setErrors((prev) => ({ ...prev, price: '' })) }}
              required
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
            <div className="flex gap-2">
              {showNewCategory ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Type new category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNewCategory()}
                  />
                  <Button type="button" size="sm" onClick={handleAddNewCategory}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewCategory(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 relative">
                    {categories.length > 0 ? (
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="Type category name"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    )}
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={() => { setShowNewCategory(true); setNewCategoryName('') }} className="shrink-0 gap-1">
                    <Tag className="w-3.5 h-3.5" /> New
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Sizes / Types</label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    selectedSizes.includes(size)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-accent'
                  )}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description (optional)</label>
            <Input
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Stock</label>
            <Input
              type="number" min="0"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Plus className="w-4 h-4" />
              {editProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
