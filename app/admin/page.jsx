'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminCatalogPage() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [place, setPlace] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('IDR')
  const [available, setAvailable] = useState(true)
  const [tags, setTags] = useState('') // comma separated

  const [files, setFiles] = useState([]) // File[]
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState([]) // array of secure_url
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [products, setProducts] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [selectedId, setSelectedId] = useState('') // edit mode when set

  const descValid = desc.trim().length >= 6
  const contentValid = content.trim().length >= 6
  const placeValid = place.trim().length >= 2
  const categoryValid = category.trim().length >= 2
  const dateValid = !!date
  const priceValid = Number(price) >= 0 && price !== ''
  const canSubmit = title.trim().length > 0 && descValid && contentValid && placeValid && categoryValid && dateValid && priceValid && uploaded.length > 0

  async function loadProducts() {
    try {
      setLoadingList(true)
      const res = await fetch('/api/catalog')
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        const arr = Array.isArray(data.products) ? data.products : []
        const mapped = arr.map((p) => {
          const idStr = typeof p._id === 'string' ? p._id : (p?._id?.$oid || p?._id?.oid || '')
          return { ...p, _idStr: idStr }
        })
        setProducts(mapped)
      }
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function onPickFiles(e) {
    const list = Array.from(e.target.files || [])
    setFiles(list)
    setError('')
  }

  async function handleUpload() {
    try {
      setUploading(true)
      setError('')
      setSuccessMsg('')
      if (!files.length) {
        setError('Pilih minimal satu file untuk diunggah')
        setUploading(false)
        return
      }
      const form = new FormData()
      for (const f of files) form.append('files', f)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        setError(data?.error || 'Upload gagal')
        setUploading(false)
        return
      }
      const urls = (data.uploaded || []).map((u) => u.secure_url || u.url).filter(Boolean)
      if (!urls.length) {
        setError('Tidak ada URL yang diterima dari upload')
        setUploading(false)
        return
      }
      setUploaded((prev) => [...prev, ...urls])
      setFiles([])
      setSuccessMsg('Upload berhasil')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload error')
    } finally {
      setUploading(false)
    }
  }

  function removeUploaded(i) {
    setUploaded((prev) => prev.filter((_, idx) => idx !== i))
  }

  function resetForm() {
    setSelectedId(''); setTitle(''); setDesc(''); setContent(''); setDate(''); setPlace(''); setCategory(''); setPrice(''); setCurrency('IDR'); setAvailable(true); setTags(''); setFiles([]); setUploaded([]); setError(''); setSuccessMsg('')
  }

  function startEdit(p) {
    const id = typeof p._id === 'string' ? p._id : (p?._id?.$oid || p?._id?.oid || p?._idStr || '')
    setSelectedId(id)
    setTitle(p.title || '')
    setDesc(p.description || p.desc || '')
    setContent(p.content || '')
    setDate(p.date ? new Date(p.date).toISOString().slice(0,10) : '')
    setPlace(p.place || '')
    setCategory(p.category || '')
    setPrice(String(p.price ?? ''))
    setCurrency(p.currency || 'IDR')
    setAvailable(!!p.available)
    setTags((p.tags || []).join(', '))
    setUploaded(p.images || (p.imageUrl ? [p.imageUrl] : []))
    setFiles([])
    setError('')
    setSuccessMsg('Mode edit: perbarui data lalu simpan')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const body = {
      title: title.trim(),
      desc: desc.trim(),
      content: content.trim(),
      date: date, // expect YYYY-MM-DD
      place: place.trim(),
      category: category.trim().toLowerCase(),
      price: Number(price),
      currency: currency.trim().toUpperCase(),
      images: uploaded,
      available,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    }

    try {
      const url = selectedId ? `/api/catalog/${selectedId}` : '/api/catalog'
      const method = selectedId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        const details = data?.details ? `\nDetails: ${JSON.stringify(data.details)}` : ''
        throw new Error(data?.error ? `${data.error}${details}` : 'Gagal menyimpan katalog')
      }
      setSuccessMsg(selectedId ? 'Produk berhasil diperbarui' : 'Produk berhasil dibuat')
      resetForm()
      await loadProducts()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan katalog')
    }
  }

  async function handleDelete(id) {
    if (!id) return
    const ok = confirm('Yakin hapus produk ini? Tindakan ini tidak bisa dibatalkan.')
    if (!ok) return
    try {
      const res = await fetch(`/api/catalog/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data?.error || 'Gagal menghapus')
      if (selectedId === id) resetForm()
      await loadProducts()
      setSuccessMsg('Produk dihapus')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus')
    }
  }

  return (
    <div className='w-full bg-white py-8 lg:py-12 relative overflow-hidden'>
      <div className='w-full h-full flex flex-col gap-6 md:gap-10 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl md:text-3xl font-bold'>Admin • {selectedId ? 'Edit' : 'Tambah'} Produk Katalog</h1>
          <Link href='/catalog' className='px-4 py-2 rounded-md border border-[#0E121D] text-[#0E121D] font-semibold hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition'>
            Lihat Katalog
          </Link>
        </div>

        {error && (
          <div className='p-3 rounded-md bg-red-50 text-red-700 border border-red-200 whitespace-pre-wrap'>
            {error}
          </div>
        )}
        {successMsg && (
          <div className='p-3 rounded-md bg-green-50 text-green-700 border border-green-200'>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-semibold mb-1'>Judul (title)</label>
              <input className='w-full border rounded-md px-3 py-2' value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-1'>Ringkasan (desc) min 6</label>
              <textarea className='w-full border rounded-md px-3 py-2' rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} required />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-1'>Konten (content) min 6</label>
              <textarea className='w-full border rounded-md px-3 py-2' rows={6} value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-1'>Tanggal (date)</label>
                <input type='date' className='w-full border rounded-md px-3 py-2' value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div>
                <label className='block text-sm font-semibold mb-1'>Lokasi (place)</label>
                <input className='w-full border rounded-md px-3 py-2' value={place} onChange={(e) => setPlace(e.target.value)} required />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-1'>Kategori (category)</label>
                <input className='w-full border rounded-md px-3 py-2' value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>
              <div>
                <label className='block text-sm font-semibold mb-1'>Harga (price)</label>
                <input type='number' min='0' className='w-full border rounded-md px-3 py-2' value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-1'>Mata Uang (currency)</label>
                <input className='w-full border rounded-md px-3 py-2' value={currency} onChange={(e) => setCurrency(e.target.value)} />
              </div>
              <div>
                <label className='block text-sm font-semibold mb-1'>Tags (pisahkan dengan koma)</label>
                <input className='w-full border rounded-md px-3 py-2' value={tags} onChange={(e) => setTags(e.target.value)} placeholder='neon,box,custom' />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-semibold mb-1'>Upload Gambar (multi)</label>
              <input type='file' multiple accept='image/*' onChange={onPickFiles} />
              <button type='button' onClick={handleUpload} disabled={uploading || files.length === 0} className='ml-2 px-3 py-2 rounded-md border border-[#0E121D] text-[#0E121D] font-semibold hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition disabled:opacity-50'>
                {uploading ? 'Mengunggah...' : 'Upload ke Cloudinary'}
              </button>
            </div>

            {files.length > 0 && (
              <div className='text-sm text-accent-foreground/70'>File dipilih: {files.map(f => f.name).join(', ')}</div>
            )}

            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
              {uploaded.map((url, i) => (
                <div key={i} className='relative group border rounded-md overflow-hidden'>
                  <Image src={url} alt={`img-${i}`} width={240} height={180} className='w-full h-28 object-cover' />
                  <button type='button' onClick={() => removeUploaded(i)} className='absolute top-1 right-1 text-xs bg-red-600 text-white px-2 py-1 rounded opacity-80 group-hover:opacity-100'>Hapus</button>
                </div>
              ))}
            </div>

            <div className='flex items-center gap-2'>
              <input id='available' type='checkbox' checked={available} onChange={(e) => setAvailable(e.target.checked)} />
              <label htmlFor='available' className='text-sm'>Tersedia (available)</label>
            </div>

            <div className='flex gap-3'>
              <button type='submit' disabled={!canSubmit} className='inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#0E121D] text-white font-semibold hover:bg-[#0E121D]/90 transition disabled:opacity-50 disabled:cursor-not-allowed'>{selectedId ? 'Simpan Perubahan' : 'Simpan Produk'}</button>
              <button type='button' onClick={resetForm} className='inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#0E121D] text-[#0E121D] font-semibold hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition'>Reset</button>
            </div>
          </div>
        </form>

        <div className='mt-8'>
          <h2 className='text-xl font-bold mb-3'>Daftar Produk</h2>
          {loadingList ? (
            <div className='text-accent-foreground/70'>Memuat...</div>
          ) : products.length === 0 ? (
            <div className='text-accent-foreground/70'>Belum ada produk</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {products.map((p) => (
                <div key={p._id} className='border rounded-lg p-3 flex flex-col gap-2'>
                  <div className='w-full aspect-[4/3] bg-gray-100 rounded overflow-hidden'>
                    <Image src={(p.images && p.images[0]) || p.imageUrl || '/under.png'} alt={p.title || 'item'} width={400} height={300} className='w-full h-full object-cover' />
                  </div>
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <div className='font-semibold'>{p.title}</div>
                      <div className='text-xs text-accent-foreground/70 capitalize'>{p.category}{p.place ? ` • ${p.place}` : ''}</div>
                    </div>
                    <div className='text-right text-sm font-bold'>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: p.currency || 'IDR', maximumFractionDigits: 0 }).format(p.price || 0)}</div>
                  </div>
                  <div className='flex gap-2 mt-1'>
                    <button type='button' onClick={() => startEdit(p)} className='px-3 py-1 text-sm rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition'>Edit</button>
                    <button onClick={() => handleDelete(p._id)} className='px-3 py-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition'>Delete</button>
                    <Link href={`/catalog/${p.slug}`} className='ml-auto px-3 py-1 text-sm rounded border border-gray-700 text-gray-700 hover:bg-gray-800 hover:text-white transition'>Lihat</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
