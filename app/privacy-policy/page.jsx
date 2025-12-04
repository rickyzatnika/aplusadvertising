export const metadata = {
  title: 'Privacy Policy',
  description: 'Kebijakan privasi Aplus Advertising mengenai pengumpulan, penggunaan, dan perlindungan data pengguna.',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <div className='w-full bg-white py-8 lg:py-12 relative overflow-hidden'>
      <div className='w-full h-full flex flex-col gap-6 md:gap-8 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 max-w-5xl mx-auto'>
        <h1 className='text-3xl md:text-4xl font-bold'>Privacy Policy</h1>
        <p className='text-accent-foreground/80'>Terakhir diperbarui: {new Date().getFullYear()}</p>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>1. Informasi yang Kami Kumpulkan</h2>
          <p>Kami dapat mengumpulkan informasi seperti nama, email, nomor telepon, dan konten pesan saat Anda mengisi formulir kontak atau berkomunikasi dengan kami.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>2. Penggunaan Informasi</h2>
          <p>Informasi digunakan untuk keperluan komunikasi, pemrosesan permintaan, perbaikan layanan, dan penyediaan informasi terkait produk/layanan kami.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>3. Berbagi Data</h2>
          <p>Kami tidak menjual data pribadi Anda. Data dapat dibagikan kepada pihak ketiga tepercaya untuk pemrosesan layanan (mis., layanan hosting, analitik) sesuai kebutuhan.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>4. Keamanan</h2>
          <p>Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data Anda. Namun, tidak ada metode transmisi atau penyimpanan data yang sepenuhnya aman.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>5. Hak Anda</h2>
          <p>Anda dapat meminta akses, koreksi, atau penghapusan data pribadi Anda dengan menghubungi kami melalui laman kontak.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>6. Perubahan Kebijakan</h2>
          <p>Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Versi terbaru akan selalu tersedia pada halaman ini.</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>7. Kontak</h2>
          <p>Jika ada pertanyaan terkait kebijakan ini, silakan hubungi kami melalui halaman <a href='/contact' className='underline'>Kontak</a>.</p>
        </section>
      </div>
    </div>
  )
}
