'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  requireCertificate: boolean
}

export default function AddCertificate() {
  const [formData, setFormData] = useState({
    productId: '',
    certificateType: '',
    certificateNumber: '',
    issuingAuthority: '',
    validFrom: '',
    validTo: '',
    certificateFile: '',
  })
  const [products, setProducts] = useState<{id: string, title: string}[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/factory/login')
      return
    }
    // Load my products
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/factory/products')
        const data = await res.json()
        if (data.success) {
          setProducts(data.data.products)
        }
      } catch (err) {
        console.error('Failed to load products', err)
      }
    }
    loadProducts()
  }, [router])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/factory/certificates/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/factory/certificates')
      } else {
        alert(data.error || 'Failed to add certificate')
      }
    } catch (err) {
      console.error('Failed to submit', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Product Certificate</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a new qualification certificate for your product
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              id="productId"
              required
              value={formData.productId}
              onChange={(e) => handleChange('productId', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Type *
            </label>
            <input
              id="certificateType"
              required
              value={formData.certificateType}
              onChange={(e) => handleChange('certificateType', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. UL, FDA"
            />
          </div>
          <div>
            <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Number *
            </label>
            <input
              id="certificateNumber"
              required
              value={formData.certificateNumber}
              onChange={(e) => handleChange('certificateNumber', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="12345"
            />
          </div>
          <div>
            <label htmlFor="issuingAuthority" className="block text-sm font-medium text-gray-700 mb-1">
              Issuing Authority *
            </label>
            <input
              id="issuingAuthority"
              required
              value={formData.issuingAuthority}
              onChange={(e) => handleChange('issuingAuthority', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Underwriters Laboratories"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700 mb-1">
                Valid From
              </label>
              <input
                type="date"
                id="validFrom"
                value={formData.validFrom}
                onChange={(e) => handleChange('validFrom', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="validTo" className="block text-sm font-medium text-gray-700 mb-1">
                Valid To
              </label>
              <input
                type="date"
                id="validTo"
                value={formData.validTo}
                onChange={(e) => handleChange('validTo', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-700 mb-1">
              Certificate File URL
            </label>
            <input
              type="url"
              id="certificateFile"
              value={formData.certificateFile}
              onChange={(e) => handleChange('certificateFile', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
       
...(truncated)...
