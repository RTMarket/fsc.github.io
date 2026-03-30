'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FactoryRegisterStep2() {
  const [stripeAccountId, setStripeAccountId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Read step 1 data
  useEffect(() => {
    const step1 = localStorage.getItem('factoryRegisterStep1')
    if (!step1) {
      router.push('/factory/register/step1')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!stripeAccountId) {
      setError('Please enter Stripe account ID')
      return
    }

    setLoading(true)

    try {
      localStorage.setItem('factoryRegisterStep2', JSON.stringify({ stripeAccountId }))
      router.push('/factory/register/step3')
    } catch (err) {
      setError('Save failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Factory Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step 2: Stripe Payment Account
          </p>
          <div className="mt-2 p-4 bg-blue-50 rounded-md text-sm text-blue-700">
            <p className="font-medium">Important Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Once your payment account is bound, it <strong>cannot be changed easily</strong></li>
              <li>Changing requires admin approval</li>
            </ul>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="stripeAccountId" className="block text-sm font-medium text-gray-700">
 
...(truncated)...
