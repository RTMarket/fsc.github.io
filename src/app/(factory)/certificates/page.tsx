'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProductCertificate {
  id: string
  certificateType: string
  certificateNumber: string
  issuingAuthority: string
  validFrom?: string
  validTo?: string
  product: {
    id: string
    title: string
  }
}

export default function FactoryCertificates() {
  const [certificates, setCertificates] = useState<ProductCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadCertificates = async () => {
    try {
      const res = await fetch('/api/factory/certificates')
      const data = await res.json()
      if (data.success) {
        setCertificates(data.data)
      }
    } catch (err) {
      console.error('Failed to load', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/factory/login')
      return
    }
    loadCertificates()
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Certifications</h1>
        <Link
          href="/factory/certificates/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          + Add Certificate
        </Link>
      </div>

      {certificates.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No certificates yet</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {certificates.map((cert) => (
              <li key={cert.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center flex-wrap justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cert.certificateType} #{cert.certificateNumber}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {cert.product && cert.product.title}
                      <br />
                      Issued by: {cert.issuingAuthority}
                      {cert.validFrom && cert.validTo && (
                        <span className="ml-2">
                          ({new Date(cert.validFrom).getFullYear()} - {new Date(cert.validTo).getFullYear()})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <Link
                      href={`/factory/certificates/${cert.id}/edit`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        // delete handle
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          </ul>
        </div>
      )}
    </div>
  )
}
