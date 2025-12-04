'use client'

import { useMemo } from 'react'

export default function CategoryBarChart({ data = [] }) {
  const { maxValue, total } = useMemo(() => {
    const max = data.reduce((m, d) => Math.max(m, d.value || 0), 0)
    const sum = data.reduce((s, d) => s + (d.value || 0), 0)
    return { maxValue: max, total: sum }
  }, [data])

  if (!data.length) {
    return (
      <div className='text-accent-foreground/70 text-sm'>Belum ada data kategori untuk ditampilkan.</div>
    )
  }

  return (
    <div className='w-full border rounded-lg p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold'>Produk per Kategori</h3>
        <div className='text-xs text-accent-foreground/70'>Total: {total}</div>
      </div>
      <div className='space-y-3'>
        {data.map((d) => {
          const pct = maxValue > 0 ? (d.value / maxValue) * 100 : 0
          return (
            <div key={d.label} className='w-full'>
              <div className='flex items-center justify-between mb-1'>
                <div className='text-sm font-medium capitalize'>{d.label}</div>
                <div className='text-xs text-accent-foreground/70'>{d.value}</div>
              </div>
              <div className='w-full h-3 bg-gray-100 rounded-md overflow-hidden'>
                <div
                  className='h-3 bg-black transition-all'
                  style={{ width: `${pct}%` }}
                  aria-label={`Kategori ${d.label}`}
                  aria-valuenow={d.value}
                  aria-valuemin={0}
                  aria-valuemax={maxValue}
                  role='progressbar'
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
