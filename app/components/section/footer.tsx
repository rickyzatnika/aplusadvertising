import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='bg-white w-full h-full py-8 px-4'>
      <div className='w-full flex items-center justify-center '>
        <div className='border-b-2 border-accent-foreground w-full px-4 flex flex-col lg:flex-row items-center justify-center  gap-12 py-8 lg:gap-0'>
          <div className='w-fit lg:w-full'>
            <Image src="/logo.png" alt="logo-aplus-adv" priority={true} width={150} height={150} />
          </div>

          <ul className='w-full flex flex-col font-bold lg:flex-row uppercase items-center justify-center gap-6 lg:gap-8 text-md  text-[#0E121D]'>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/catalog">Catalog</Link>
            </li>
            <li>
              <Link href="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <div className='w-full flex items-center justify-center lg:justify-end gap-4'>
            <Link href="https://www.instagram.com/aplusadvertising/" target="_blank">
              <Image src="/instagram.png" alt="instagram" priority={true} width={30} height={30} />
            </Link>
            <Link href="https://www.facebook.com/aplusadvertising/" target="_blank">
              <Image src="/facebook.png" alt="facebook" priority={true} width={30} height={30} />
            </Link>
            <Link href="https://www.linkedin.com/company/aplusadvertising/" target="_blank">
              <Image src="/tiktok.png" alt="linkedin" priority={true} width={30} height={30} />
            </Link>
            <Link href="https://www.youtube.com/company/aplusadvertising/" target="_blank">
              <Image src="/youtube.png" alt="linkedin" priority={true} width={30} height={30} />
            </Link>
          </div>
        </div>

      </div>
      <div className='w-full bg-white py-4 text-center flex items-center justify-center text-sm font-semibold flex-col lg:flex-row gap-8 '>
        <p>© Copyright 2025 - APLUS ADVERTISING. All Right Reserved </p>
        <Link href="/privacy-policy" className='text-[#0E121D] hover:text-[#f7a619]'>Privacy Policy</Link>
        <Link href="/terms-of-service" className='text-[#0E121D] hover:text-[#f7a619]'>Terms of Service</Link>


      </div>

    </div>
  )
}

export default Footer
