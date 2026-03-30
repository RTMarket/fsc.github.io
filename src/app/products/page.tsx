'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  parentId?: string
}

interface Product {
  id: string
  title: string
  description: string
  mainImage: string
  fobPrice: number
  stock: number
  factory: {
    name: string
    factoryLevel: string
  }
  category: {
    name: string
  }
}

export default function ProductList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')
  const search = searchParams.get('search')
  const router = useRouter()

  const loadProducts = async (page: number = 1) => {
    setLoading(true)
    try {
      let url = `/api/product/list?page=${page}&pageSize=20`
      if (categoryId) url += `&category=${categoryId}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setProducts(data.data.list)
      }
    } catch (err) {
      console.error('Failed to load', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/category/list')
      const data = await res.json()
      if (data.success) {
        const all: Category[] = []
        data.data.categories.forEach((cat: any) => {
          all.push({ id: cat.id, name: cat.name, parentId: cat.parentId })
          cat.subcategories.forEach((sub: any) => {
            all.push({ id: sub.id, name: `${cat.name} > ${sub.name}`, parentId: cat.id })
          })
        })
        setCategories(all)
      }
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  useEffect(() => {
    loadCategories()
    loadProducts(1)
  }, [categoryId, search])

  const handleCategoryChange = (newCategoryId: string) => {
    const params = new URLSearchParams()
    if (newCategoryId) params.set('category', newCategoryId)
    if (search) params.set('search', search)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
        <p className="mt-1 text-gray-600">
          Discover quality products from verified US & Mexico factories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar / Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <div>
                <input
                  type="radio"
                  name="category"
                  id="category-all"
                  checked={!categoryId}
                  onChange={() => handleCategoryChange('')}
                  className="mr-2"
                />
                <label htmlFor="category-all">All Categories</label>
              </div>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <input
                    type="radio"
                    name="category"
                    id={`category-${cat.id}`}
                    checked={categoryId === cat.id}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${cat.id}`}>{cat.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading && products.length === 0 ? (
            <div className="text-center py-12">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-w-3 aspect-h-2">
                      <img
                        src={product.mainImage}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.factory.name} • {product.category.name}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">
                          ${product.fobPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </span>
                      </div>
               
...(truncated)...
