'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

function Checkbox({ checked, onChange }) {
  return (
    <input type='checkbox' className='h-4 w-4' checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
  )
}

export default function AdminCatalogTablePage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedIds, setSelectedIds] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [modalDeletingIds, setModalDeletingIds] = useState([])

  // form fields for edit modal
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [place, setPlace] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('IDR')
  const [available, setAvailable] = useState(true)
  const [tags, setTags] = useState('')

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState([]) // images array

  const allSelected = useMemo(() => rows.length > 0 && selectedIds.length === rows.length, [rows, selectedIds])

  function normalizeId(obj) {
    return typeof obj === 'string' ? obj : (obj?.$oid || obj?.oid || '')
  }

  async function fetchRows() {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/catalog`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data?.error || 'Gagal memuat data')
      const mapped = (data.products || []).map((p) => ({
        ...p,
        _idStr: normalizeId(p._id),
      }))
      setRows(mapped)
      setSelectedIds([])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRows() }, [])

  function toggleSelectAll(checked) {
    if (checked) setSelectedIds(rows.map((r) => r._idStr))
    else setSelectedIds([])
  }
  function toggleSelectOne(id, checked) {
    setSelectedIds((prev) => checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id))
  }

  function openEditModal(row) {
    setModalData(row)
    setTitle(row.title || '')
    setDesc(row.description || row.desc || '')
    setContent(row.content || '')
    setDate(row.date ? new Date(row.date).toISOString().slice(0,10) : '')
    setPlace(row.place || '')
    setCategory(row.category || '')
    setPrice(String(row.price ?? ''))
    setCurrency(row.currency || 'IDR')
    setAvailable(!!row.available)
    setTags((row.tags || []).join(', '))
    setUploaded(row.images || (row.imageUrl ? [row.imageUrl] : []))
    setFiles([])
    setModalOpen(true)
  }

  async function saveEdit() {
    if (!modalData?._idStr) return
    try {
      setError('')
      const body = {
        title: title.trim(),
        desc: desc.trim(),
        content: content.trim(),
        date: date,
        place: place.trim(),
        category: category.trim().toLowerCase(),
        price: Number(price),
        currency: currency.trim().toUpperCase(),
        images: uploaded,
        available,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      }
      const res = await fetch(`/api/catalog/${modalData._idStr}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data?.error || 'Gagal menyimpan perubahan')
      setModalOpen(false)
      setModalData(null)
      await fetchRows()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan')
    }
  }

  function openDeleteModal(ids) {
    const list = ((ids && ids.length ? ids : selectedIds) || []).filter(Boolean)
    setModalDeletingIds(list)
    setModalData(null)
    setModalOpen(true)
  }

  async function confirmBulkDelete() {
    try {
      setError('')
      const ids = (modalDeletingIds || []).filter(Boolean)
      for (const id of ids) {
        // serial to keep it simple; can be parallelized
        const res = await fetch(`/api/catalog/${id}`, { method: 'DELETE' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.success) throw new Error(data?.error || `Gagal menghapus ${id}`)
      }
      setModalOpen(false)
      setModalDeletingIds([])
      await fetchRows()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus')
    }
  }

  function onPickFiles(e) {
    const list = Array.from(e.target.files || [])
    setFiles(list)
  }
  function removeUploaded(i) {
    setUploaded((prev) => prev.filter((_, idx) => idx !== i))
  }
  async function handleUpload() {
    try {
      setUploading(true)
      if (!files.length) return
      const form = new FormData()
      for (const f of files) form.append('files', f)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      const urls = (data.uploaded || []).map((u) => u.secure_url || u.url).filter(Boolean)
      setUploaded((prev) => [...prev, ...urls])
      setFiles([])
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='w-full h-full p-4 md:p-8'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Catalog</h1>
        <div className='flex gap-2'>
          <a href='/admin/dashboard/catalog/add-catalog' className='px-3 py-2 rounded-md border bg-black text-white hover:bg-white hover:text-black'>Tambah Produk</a>
          <button type='button' onClick={() => openDeleteModal(selectedIds)} disabled={selectedIds.length === 0} className='px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50'>Delete Selected</button>
          <button type='button' onClick={fetchRows} className='px-3 py-2 rounded-md border'>Refresh</button>
        </div>
      </div>

      {error && (
        <div className='mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200'>{error}</div>
      )}

      <div className='overflow-auto border rounded-lg'>
        <table className='min-w-[800px] w-full text-sm'>
          <thead>
            <tr className='border-b bg-gray-50'>
              <th className='p-2 text-left w-10'><Checkbox checked={allSelected} onChange={toggleSelectAll} /></th>
              <th className='p-2 text-left'>Produk</th>
              <th className='p-2 text-left'>Kategori</th>
              <th className='p-2 text-left'>Harga</th>
              <th className='p-2 text-left'>Status</th>
              <th className='p-2 text-left w-48'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className='p-4 text-center text-gray-500'>Memuat...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className='p-4 text-center text-gray-500'>Tidak ada data</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r._idStr} className='border-b hover:bg-gray-50'>
                  <td className='p-2'><Checkbox checked={selectedIds.includes(r._idStr)} onChange={(c) => toggleSelectOne(r._idStr, c)} /></td>
                  <td className='p-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-14 h-10 rounded overflow-hidden bg-gray-100'>
                        <Image src={(r.images && r.images[0]) || r.imageUrl || '/under.png'} alt={r.title || 'item'} width={100} height={80} className='w-full h-full object-cover' />
                      </div>
                      <div>
                        <div className='font-semibold'>{r.title}</div>
                        <div className='text-xs text-gray-500'>{r.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className='p-2 capitalize'>{r.category}</td>
                  <td className='p-2 font-semibold'>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: r.currency || 'IDR', maximumFractionDigits: 0 }).format(r.price || 0)}</td>
                  <td className='p-2'>
                    {r.available ? (
                      <span className='px-2 py-1 rounded text-xs bg-green-100 text-green-700'>Available</span>
                    ) : (
                      <span className='px-2 py-1 rounded text-xs bg-red-100 text-red-700'>Out</span>
                    )}
                  </td>
                  <td className='p-2'>
                    <div className='flex gap-2'>
                      <button type='button' onClick={() => openEditModal(r)} className='px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'>Edit</button>
                      <button type='button' onClick={() => openDeleteModal([r._idStr])} className='px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white'>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40' onClick={() => { setModalOpen(false); setModalData(null); setModalDeletingIds([]) }} />
          <div className='relative bg-white rounded-lg shadow-lg w-[95vw] max-w-xl max-h-[85vh] p-4 overflow-y-auto'>
            {modalData ? (
              <div>
                <h3 className='text-lg font-bold mb-3'>Edit Produk</h3>
                <div className='flex flex-col gap-3'>
                  <div>
                    <label className='block text-sm mb-1'>Judul</label>
                    <input className='w-full border rounded px-3 py-2' value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>Ringkasan</label>
                    <textarea className='w-full border rounded px-3 py-2' rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>Konten</label>
                    <textarea className='w-full border rounded px-3 py-2' rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-sm mb-1'>Tanggal</label>
                      <input type='date' className='w-full border rounded px-3 py-2' value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Lokasi</label>
                      <input className='w-full border rounded px-3 py-2' value={place} onChange={(e) => setPlace(e.target.value)} />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-sm mb-1'>Kategori</label>
                      <input className='w-full border rounded px-3 py-2' value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Harga</label>
                      <input type='number' min='0' className='w-full border rounded px-3 py-2' value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-sm mb-1'>Mata Uang</label>
                      <input className='w-full border rounded px-3 py-2' value={currency} onChange={(e) => setCurrency(e.target.value)} />
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Tags (koma)</label>
                      <input className='w-full border rounded px-3 py-2' value={tags} onChange={(e) => setTags(e.target.value)} placeholder='neon,box,custom' />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>Gambar</label>
                    <input type='file' multiple accept='image/*' onChange={onPickFiles} />
                    <button type='button' onClick={handleUpload} disabled={uploading || files.length === 0} className='ml-2 px-3 py-2 rounded border disabled:opacity-50'>{uploading ? 'Uploading...' : 'Upload'}</button>
                    <div className='grid grid-cols-3 md:grid-cols-4 gap-2 mt-2'>
                      {uploaded.map((url, i) => (
                        <div key={i} className='relative group border rounded overflow-hidden'>
                          <Image src={url} alt={`img-${i}`} width={200} height={140} className='w-full h-24 object-cover' />
                          <button type='button' onClick={() => removeUploaded(i)} className='absolute top-1 right-1 text-[10px] px-1 py-0.5 bg-red-600 text-white rounded'>Hapus</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input id='avail' type='checkbox' checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                    <label htmlFor='avail' className='text-sm'>Available</label>
                  </div>
                </div>
                <div className='flex justify-end gap-2 mt-4'>
                  <button type='button' onClick={() => { setModalOpen(false); setModalData(null) }} className='px-3 py-2 rounded border'>Batal</button>
                  <button type='button' disabled={!modalData?._idStr} onClick={saveEdit} className='px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'>Simpan</button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className='text-lg font-bold mb-3'>Konfirmasi Hapus</h3>
                <p className='text-sm text-gray-600'>Anda akan menghapus {modalDeletingIds.length} produk. Tindakan ini tidak dapat dibatalkan.</p>
                <div className='flex justify-end gap-2 mt-4'>
                  <button type='button' onClick={() => { setModalOpen(false); setModalDeletingIds([]) }} className='px-3 py-2 rounded border'>Batal</button>
                  <button type='button' onClick={confirmBulkDelete} className='px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700'>Hapus</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
