"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const GetInTouch = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      setSubmitStatus({ type: null, message: '' })

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('Non-JSON response received:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: textResponse.substring(0, 500)
        })
        throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText})`)
      }

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'Terima kasih! Pesan Anda sudah terkirim.' })
        reset()
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' })
        }, 5000)
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Gagal mengirim pesan. Coba lagi ya.' })
      }
    } catch (error) {
      console.error('🚨 Error:', error)
      setSubmitStatus({ type: 'error', message: 'Gagal mengirim pesan. Coba lagi ya.' })
    }
  }

  return (
    <section id="contact" className="w-full bg-gradient-to-b from-white to-gray-50 py-14 md:py-24 px-4 md:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-6xl"
      >
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Hubungi Kami</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Punya proyek atau ide menarik? Kami siap bantu wujudkan visual terbaik untuk brand Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          {/* Info panel */}
          <div className="md:col-span-2 bg-gray-900 text-white rounded-2xl p-6 md:p-7 lg:p-8 shadow-sm">
            <h3 className="text-xl font-bold">Info Kontak</h3>
            <p className="mt-2 text-gray-300">Silakan hubungi kami melalui kanal berikut:</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-800"><Phone className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm text-gray-400">Telepon / WhatsApp</p>
                  <Link href="https://wa.me/6281214707415" target="_blank" className="text-white font-medium hover:underline">
                    +62 812-1470-7415
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-800"><Mail className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:hello.aplusadvertising@gmail.com" className="text-white font-medium hover:underline">
                    hello.aplusadvertising@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-800"><MapPin className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm text-gray-400">Alamat</p>
                  <p className="text-white font-medium">
                    Jl. Sariwangi Selatan No.165, Cibabat, Cimahi Utara, Bandung Barat, 40559
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="https://wa.me/6281214707415" target="_blank">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <MessageSquare className="h-4 w-4 mr-2" /> Chat via WhatsApp
                </Button>
              </Link>
             
            </div>
          </div>

          {/* Form panel */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 md:p-7 lg:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Kirim Pesan</h3>
            <p className="mt-2 text-gray-600 text-sm">Kami akan membalas secepatnya melalui email yang Anda cantumkan.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5">
             

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Nama</Label>
                <input
                  id="name"
                  {...register('name', { required: 'Nama wajib diisi' })}
                  className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60"
                  placeholder="Nama lengkap"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <span className="text-red-500 text-sm">* {errors.name.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Format email tidak valid',
                    },
                  })}
                  className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60"
                  placeholder="nama@perusahaan.com"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className="text-red-500 text-sm">* {errors.email.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message" className="text-sm font-medium">Pesan</Label>
                <textarea
                  id="message"
                  {...register('message', { required: 'Pesan wajib diisi' })}
                  className="min-h-[120px] w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60"
                  placeholder="Ceritakan kebutuhan Anda atau pertanyaan di sini..."
                  aria-invalid={!!errors.message}
                />
                {errors.message && <span className="text-red-500 text-sm">* {errors.message.message}</span>}
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs ">Kami menjaga kerahasiaan data Anda.</p>
                <Button type="submit" disabled={isSubmitting} className="bg-black/90 text-gray-200 hover:bg-black">
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </div>
               {submitStatus.type && (
                <div className={`p-3 rounded-md text-sm border ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default GetInTouch
