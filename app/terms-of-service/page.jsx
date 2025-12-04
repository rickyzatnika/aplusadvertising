export const metadata = {
  title: 'Terms of Service',
  description: 'Syarat dan Ketentuan penggunaan layanan Aplus Advertising.',
  alternates: { canonical: '/terms-of-service' },
}

export default function TermsOfServicePage() {
  return (
    <div className='w-full bg-white py-8 lg:py-12 relative overflow-hidden'>
      <div className='w-full h-full flex flex-col gap-6 md:gap-8 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 max-w-5xl mx-auto'>
        <h1 className='text-3xl md:text-4xl font-bold'>Terms of Service</h1>
        <p className='text-accent-foreground/80'>Terakhir diperbarui: {new Date().getFullYear()}</p>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>1. Penerimaan Syarat</h2>
          <p>Dengan mengakses atau menggunakan situs dan layanan kami, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>2. Penggunaan yang Diizinkan</h2>
          <p>Anda setuju untuk tidak menyalahgunakan situs ini, termasuk namun tidak terbatas pada kegiatan ilegal, merusak, atau melanggar hak pihak lain.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>3. Konten</h2>
          <p>Konten yang ditampilkan bersifat informatif. Kami berhak memperbarui, mengubah, atau menghapus konten kapan pun tanpa pemberitahuan sebelumnya.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>4. Batasan Tanggung Jawab</h2>
          <p>Kami tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan situs atau layanan kami.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>5. Perubahan Syarat</h2>
          <p>Kami dapat memperbarui Syarat dan Ketentuan ini dari waktu ke waktu. Versi terbaru akan ditampilkan di halaman ini.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>6. Hukum yang Berlaku</h2>
          <p>Syarat dan Ketentuan ini diatur oleh hukum yang berlaku di Indonesia.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>7. Kontak</h2>
          <p>Untuk pertanyaan lebih lanjut, silakan hubungi kami melalui laman <a href='/contact' className='underline'>Kontak</a>.</p>
        </section>
      </div>
    </div>
  )
}
