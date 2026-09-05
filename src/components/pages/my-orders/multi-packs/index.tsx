import BannerTitleComponent from '@/components/common/banner-title'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MultiPackOrderDetailsComponent = () => {
  return (
    <>
        <div className='flex flex-col gap-3 items-start w-full'>
              <Link href={'/tracks'} className='text-xs flex items-center pt-5 gap-2'>
                  <ArrowLeft className='w-4 h-4'/>
                  My Orders
              </Link>
              <BannerTitleComponent
                title='Your Orders'
                description='You can now download the multi packs here.'
                />
        </div>
    </>
  )
}

export default MultiPackOrderDetailsComponent